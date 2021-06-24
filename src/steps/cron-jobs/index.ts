import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Batch1BetaClient } from '../../kubernetes/clients/batch1beta';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createCronJobEntity } from './converters';

export async function fetchCronJobs(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new Batch1BetaClient(config);

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedCronJobs(
        namespaceEntity.name as string,
        async (cronJob) => {
          const cronJobEntity = createCronJobEntity(cronJob);
          await jobState.addEntity(cronJobEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: cronJobEntity,
            }),
          );
        },
      );
    },
  );
}

export const cronJobsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CRONJOBS,
    name: 'Fetch CronJobs',
    entities: [Entities.CRONJOB],
    relationships: [Relationships.NAMESPACE_CONTAINS_CRONJOB],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchCronJobs,
  },
];
