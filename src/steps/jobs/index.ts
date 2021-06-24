import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { BatchClient } from '../../kubernetes/clients/batch';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createJobEntity } from './converters';

export async function fetchJobs(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new BatchClient(config);

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedJobs(
        namespaceEntity.name as string,
        async (job) => {
          const jobEntity = createJobEntity(job);
          await jobState.addEntity(jobEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: jobEntity,
            }),
          );

          for (const owner of job.metadata?.ownerReferences || []) {
            const ownerEntity = await jobState.findEntity(owner.uid);
            // This comment will be kept up to date during development:
            // So far, it seems that job's owner can be CronJob
            // This check serves as a safeguard to only let "vetted" relationships pass through
            // Without it, we may create some relationship that we didn't configure below
            if (ownerEntity && ['CronJob'].includes(owner.kind)) {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.MANAGES,
                  from: ownerEntity,
                  to: jobEntity,
                }),
              );
            }
          }
        },
      );
    },
  );
}

export const jobsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.JOBS,
    name: 'Fetch Jobs',
    entities: [Entities.JOB],
    relationships: [
      Relationships.NAMESPACE_CONTAINS_JOB,
      Relationships.CRONJOB_MANAGES_JOB,
    ],
    dependsOn: [IntegrationSteps.NAMESPACES, IntegrationSteps.CRONJOBS],
    executionHandler: fetchJobs,
  },
];
