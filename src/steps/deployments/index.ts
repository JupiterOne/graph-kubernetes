import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { AppsClient } from '../../kubernetes/clients/apps';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import {
  createContainerSpecEntity,
  createDeploymentEntity,
  createVolumeEntity,
  getVolumeKey,
} from './converters';

export async function fetchDeployments(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new AppsClient(config);

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedDeployments(
        namespaceEntity.name as string,
        async (deployment) => {
          const deploymentEntity = createDeploymentEntity(deployment);

          for (const volume of deployment.spec?.template.spec?.volumes || []) {
            const volumeEntity = createVolumeEntity(
              deployment.metadata?.uid as string,
              volume,
            );
            await jobState.addEntity(volumeEntity);
          }

          for (const container of deployment.spec?.template.spec?.containers ||
            []) {
            const containerSpecEntity = createContainerSpecEntity(
              deployment.metadata?.uid as string,
              container,
            );
            await jobState.addEntity(containerSpecEntity);
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.USES,
                from: deploymentEntity,
                to: containerSpecEntity,
              }),
            );

            for (const volumeMount of container.volumeMounts || []) {
              const volumeEntity = await jobState.findEntity(
                getVolumeKey(
                  deployment.metadata?.uid as string,
                  volumeMount.name,
                ),
              );
              if (!volumeEntity) {
                continue;
              }

              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.USES,
                  from: containerSpecEntity,
                  to: volumeEntity,
                  properties: {
                    readOnly: volumeMount.readOnly,
                    mountPath: volumeMount.mountPath,
                    mountPropagation: volumeMount.mountPropagation,
                    subPath: volumeMount.subPath,
                  },
                }),
              );
            }
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
