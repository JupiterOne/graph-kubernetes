import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { RbacAuthorizationClient } from '../../kubernetes/clients/rbac';
import { createClusterRoleEntity } from './converter';

export async function fetchClusterRoles(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;
  const { config } = instance;

  const client = new RbacAuthorizationClient(config);

  await client.iterateClusterRoles(async (clusterRole) => {
    // console.log('clusterRole', clusterRole)
    const clusterRoleEntity = createClusterRoleEntity(clusterRole);
    await jobState.addEntity(clusterRoleEntity);
  })
}

export async function fetchClusterRoleBindings(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;
  const { config } = instance;

  const client = new RbacAuthorizationClient(config);
  await client.iterateClusterRoleBindings(async (clusterRoleBinding) => {
    // if (clusterRoleBinding.metadata?.name === "jupiterone-integration-cluster")
      // console.log('clusterRoleBinding', clusterRoleBinding)
  })
}

export const clusterRoleBindingsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CLUSTER_ROLES,
    name: 'Fetch Cluster Roles',
    entities: [Entities.CLUSTER_ROLE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchClusterRoles,
  },
  {
    id: IntegrationSteps.CLUSTER_ROLE_BINDINGS,
    name: 'Fetch Cluster Role Bindings',
    entities: [],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchClusterRoleBindings,
  },
];
