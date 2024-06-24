import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { V1CronJob } from '@kubernetes/client-node';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { createCronJobEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import { createContainerSpecEntity, getContainerSpecKey } from '../deployments/converters';

export async function fetchCronJobs(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

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

          for (const container of cronJob.spec?.jobTemplate?.spec?.template
            ?.spec?.containers ||
            [] ||
            []) {
            const cronJobContainerspecEntity = createContainerSpecEntity(container);
            // Check if the entity is already present in jobState
            if (jobState.hasKey(cronJobContainerspecEntity._key)) {
              continue; // Skip to the next iteration if the entity is already present
            }

            await jobState.addEntity(cronJobContainerspecEntity);
          }
        },
      );
    },
  );
}

export async function buildContainerSpecCronJobRelationship(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;
  await jobState.iterateEntities(
    {
      _type: Entities.CRONJOB._type,
    },
    async (cronJobEntity) => {
      const rawNode = getRawData<V1CronJob>(cronJobEntity);
      const cronJobContainer =
        rawNode?.spec?.jobTemplate?.spec?.template?.spec?.containers;
      if (cronJobContainer) {
        for (const container of cronJobContainer) {
          const containerSpecKey = getContainerSpecKey(container.name)

          if (!containerSpecKey) {
            throw new IntegrationMissingKeyError(
              `Cannot build Relationship.
              Error: Missing Key.
              containerSpecKey : ${containerSpecKey}`,
            );
          }

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              fromKey: containerSpecKey,
              fromType: Entities.CONTAINER_SPEC._type,
              toKey: cronJobEntity._key,
              toType: Entities.CRONJOB._type,
            }),
          );
        }
      }
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
  {
    id: IntegrationSteps.CONTAINER_SPEC_HAS_CRON_JOB,
    name: 'Build Container Spec HAS CronJob relationship',
    entities: [],
    relationships: [Relationships.CONTAINER_SPEC_HAS_CRONJOB],
    dependsOn: [IntegrationSteps.CRONJOBS],
    executionHandler: buildContainerSpecCronJobRelationship,
  },
];
