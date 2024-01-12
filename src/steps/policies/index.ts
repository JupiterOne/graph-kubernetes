import {
  createDirectRelationship,
  RelationshipClass,
  IntegrationStep,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createNetworkPolicyEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchNetworkPolicies(
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
      await client.iterateNamespacedNetworkPolicies(
        namespaceEntity.name as string,
        async (networkPolicy) => {
          const networkPolicyEntity = createNetworkPolicyEntity(networkPolicy);
          await jobState.addEntity(networkPolicyEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: networkPolicyEntity,
            }),
          );
        },
      );
    },
  );
}

export const policiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.NETWORK_POLICIES,
    name: 'Fetch Network Policies',
    entities: [Entities.NETWORK_POLICY],
    relationships: [Relationships.NAMESPACE_CONTAINS_NETWORK_POLICY],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchNetworkPolicies,
  },
];
