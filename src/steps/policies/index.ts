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
import { PolicyClient } from '../../kubernetes/clients/policy';
import { createPodSecurityPolicyEntity } from './converters';

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

export const policiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.POD_SECURITY_POLICIES,
    name: 'Fetch Pod Security Policies',
    entities: [Entities.POD_SECURITY_POLICY],
    relationships: [Relationships.CLUSTER_CONTAINS_POD_SECURITY_POLICY],
    dependsOn: [IntegrationSteps.CLUSTERS],
    executionHandler: fetchPodSecurityPolicies,
  },
];
