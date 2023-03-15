import {
  createDirectRelationship,
  RelationshipClass,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationStepContext } from '../../config';
import {
  CLUSTER_ENTITY_DATA_KEY,
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { PolicyClient } from '../../kubernetes/clients/policy';
import {
  createNetworkPolicyEntity,
  createPodSecurityPolicyEntity,
} from './converters';
import { NetworkClient } from '../../kubernetes/clients/network';
import { KubernetesIntegrationStep } from '../../types';

export async function fetchPodSecurityPolicies(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new PolicyClient(config);

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

  const client = new NetworkClient(config);

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

export const policiesSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.POD_SECURITY_POLICIES,
    name: 'Fetch Pod Security Policies',
    entities: [Entities.POD_SECURITY_POLICY],
    relationships: [Relationships.CLUSTER_CONTAINS_POD_SECURITY_POLICY],
    dependsOn: [IntegrationSteps.CLUSTERS],
    executionHandler: fetchPodSecurityPolicies,
    permissions: [
      {
        apiGroups: ['policy'],
        resources: ['podsecuritypolicies'],
        verbs: ['list'],
      },
    ],
  },
  {
    id: IntegrationSteps.NETWORK_POLICIES,
    name: 'Fetch Network Policies',
    entities: [Entities.NETWORK_POLICY],
    relationships: [Relationships.NAMESPACE_CONTAINS_NETWORK_POLICY],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchNetworkPolicies,
    permissions: [
      {
        apiGroups: ['network'],
        resources: ['networkpolicies'],
        verbs: ['list'],
      },
    ],
  },
];
