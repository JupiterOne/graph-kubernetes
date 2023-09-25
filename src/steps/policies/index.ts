import {
  createDirectRelationship,
  RelationshipClass,
  IntegrationStep,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  CLUSTER_ENTITY_DATA_KEY,
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import {
  createNetworkPolicyEntity,
  createPodSecurityPolicyEntity,
} from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchPodSecurityPolicies(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

  const clusterEntity = (await jobState.getData(
    CLUSTER_ENTITY_DATA_KEY,
  )) as Entity;

  await client.iteratePodSecurityPolicies(async (podSecurityPolicy) => {
    const pspEntity = createPodSecurityPolicyEntity(podSecurityPolicy);
    await jobState.addEntity(pspEntity);
    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.CONTAINS,
        from: clusterEntity,
        to: pspEntity,
      }),
    );
  });
}

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
    id: IntegrationSteps.POD_SECURITY_POLICIES,
    name: 'Fetch Pod Security Policies',
    entities: [Entities.POD_SECURITY_POLICY],
    relationships: [Relationships.CLUSTER_CONTAINS_POD_SECURITY_POLICY],
    dependsOn: [IntegrationSteps.CLUSTERS],
    executionHandler: fetchPodSecurityPolicies,
  },
  {
    id: IntegrationSteps.NETWORK_POLICIES,
    name: 'Fetch Network Policies',
    entities: [Entities.NETWORK_POLICY],
    relationships: [Relationships.NAMESPACE_CONTAINS_NETWORK_POLICY],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchNetworkPolicies,
  },
];
