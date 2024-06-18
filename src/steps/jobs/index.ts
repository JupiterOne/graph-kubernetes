import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { ContainerspecType, Entities, IntegrationSteps, Relationships } from '../constants';
import { createJobEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import { createContainerSpecEntity } from '../deployments/converters';

export async function fetchJobs(
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

          for (const container of job.spec?.template?.spec?.containers ||
            []) {

            const containerspecEntity = createContainerSpecEntity(ContainerspecType.JOB, container)
            await jobState.addEntity(containerspecEntity);
          }
        },
      );
    },
  );
}

export async function buildContainerSpecJobRelationship(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;
  await jobState.iterateEntities(
    {
      _type: Entities.JOB._type,
    },
    async (jobEntity) => {
      const rawNode = getRawData<k8s.V1Job>(jobEntity);
      const jobContainer = rawNode?.spec?.template.spec?.containers;
      if (jobContainer) {
        for (const container of jobContainer) {
          const containerSpecKey = ContainerspecType.JOB + "/" + container.name as string;

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
              toKey: jobEntity._key,
              toType: Entities.JOB._type,
            }),
          );
        }
      }
    },
  );
}


export const jobsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.JOBS,
    name: 'Fetch Jobs',
    entities: [Entities.JOB, Entities.CONTAINER_SPEC],
    relationships: [
      Relationships.NAMESPACE_CONTAINS_JOB,
      Relationships.CRONJOB_MANAGES_JOB,
    ],
    dependsOn: [IntegrationSteps.NAMESPACES, IntegrationSteps.CRONJOBS],
    executionHandler: fetchJobs,
  },
  {
    id: IntegrationSteps.CONTAINER_SPEC_HAS_JOB,
    name: 'Build Container Spec HAS Job relationship',
    entities: [],
    relationships: [
      Relationships.CONTAINER_SPEC_HAS_JOB,
    ],
    dependsOn: [IntegrationSteps.JOBS],
    executionHandler: buildContainerSpecJobRelationship,
  },
];
