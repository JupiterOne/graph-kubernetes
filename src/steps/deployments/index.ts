import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { AppsClient } from '../../kubernetes/clients/apps';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createDeploymentEntity } from './converters';

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
          await jobState.addEntity(deploymentEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
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
    entities: [Entities.DEPLOYMENT],
    relationships: [Relationships.NAMESPACE_HAS_DEPLOYMENT],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchDeployments,
  },
];
