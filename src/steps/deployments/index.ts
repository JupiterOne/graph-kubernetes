import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  JobState,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import {
  createContainerSpecEntity,
  createContainerSpecToVolumeRelationship,
  createDeploymentEntity,
  createVolumeEntity,
  getVolumeKey,
} from './converters';
import { V1VolumeMount } from '@kubernetes/client-node';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

type BuildContainerSpecVolumeRelationshipsParams = {
  jobState: JobState;
  namespace: string;
  deploymentId: string;
  containerSpecEntity: Entity;
  volumeMounts: V1VolumeMount[] | undefined;
};

async function buildContainerSpecVolumeRelationships({
  jobState,
  namespace,
  deploymentId,
  containerSpecEntity,
  volumeMounts,
}: BuildContainerSpecVolumeRelationshipsParams) {
  for (const volumeMount of volumeMounts || []) {
    const volumeEntity = await jobState.findEntity(
      getVolumeKey(namespace, deploymentId, volumeMount.name),
    );

    if (!volumeEntity) {
      continue;
    }

    await jobState.addRelationship(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity,
        volumeEntity,
        volumeMount,
      }),
    );
  }
}

export async function fetchDeployments(
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
      await client.iterateNamespacedDeployments(
        namespaceEntity.name as string,
        async (deployment) => {
          const deploymentId = deployment.metadata?.uid as string;
          const deploymentEntity = createDeploymentEntity(deployment);

          // Possibly due to a Deployment that changed after originally fetched
          if (jobState.hasKey(deploymentEntity._key)) return;

          for (const volume of deployment.spec?.template.spec?.volumes || []) {
            const volumeEntity = createVolumeEntity(
              namespaceEntity.name as string,
              deploymentId,
              volume,
            );
            if (!jobState.hasKey(volumeEntity._key)) {
              await jobState.addEntity(volumeEntity);
            }
          }

          for (const container of deployment.spec?.template.spec?.containers ||
            []) {
            const containerSpecEntity = createContainerSpecEntity(
              namespaceEntity.name as string,
              container,
            );
            if (jobState.hasKey(containerSpecEntity._key)) {
              continue;
            }
            await jobState.addEntity(containerSpecEntity);

            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.USES,
                from: deploymentEntity,
                to: containerSpecEntity,
              }),
            );

            await buildContainerSpecVolumeRelationships({
              jobState,
              namespace: namespaceEntity.name as string,
              deploymentId,
              containerSpecEntity,
              volumeMounts: container.volumeMounts,
            });
          }

          await jobState.addEntity(deploymentEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: deploymentEntity,
            }),
          );
        },
      );
    },
  );
}

export const deploymentsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.DEPLOYMENTS,
    name: 'Fetch Deployments',
    entities: [Entities.DEPLOYMENT, Entities.CONTAINER_SPEC, Entities.VOLUME],
    relationships: [
      Relationships.NAMESPACE_CONTAINS_DEPLOYMENT,
      Relationships.DEPLOYMENT_USES_CONTAINER_SPEC,
      Relationships.CONTAINER_SPEC_USES_VOLUME,
    ],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchDeployments,
  },
];
