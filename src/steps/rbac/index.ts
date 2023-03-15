import {
  createDirectRelationship,
  Entity,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationStepContext } from '../../config';
import {
  CLUSTER_ENTITY_DATA_KEY,
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { RbacAuthorizationClient } from '../../kubernetes/clients/rbac';
import {
  createClusterRoleBindingEntity,
  createClusterRoleEntity,
  createRoleBindingEntity,
  createRoleEntity,
} from './converters';
import { KubernetesIntegrationStep } from '../../types';

export async function fetchRoles(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new RbacAuthorizationClient(config);
  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedRoles(
        namespaceEntity.name as string,
        async (role) => {
          const roleEntity = createRoleEntity(role);
          await jobState.addEntity(roleEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: roleEntity,
            }),
          );
        },
      );
    },
  );
}

export async function fetchClusterRoles(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const clusterEntity = (await jobState.getData(
    CLUSTER_ENTITY_DATA_KEY,
  )) as Entity;

  const client = new RbacAuthorizationClient(config);
  await client.iterateClusterRoles(async (clusterRole) => {
    const clusterRoleEntity = createClusterRoleEntity(clusterRole);
    await jobState.addEntity(clusterRoleEntity);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.CONTAINS,
        from: clusterEntity,
        to: clusterRoleEntity,
        properties: {
          _type: 'kube_cluster_contains_cluster_role',
        },
      }),
    );
  });
}

export async function fetchRoleBindings(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new RbacAuthorizationClient(config);

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedRoleBindings(
        namespaceEntity.name as string,
        async (roleBinding) => {
          const roleBindingEntity = createRoleBindingEntity(roleBinding);
          await jobState.addEntity(roleBindingEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: roleBindingEntity,
            }),
          );
        },
      );
    },
  );
}

export async function fetchClusterRoleBindings(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const clusterEntity = (await jobState.getData(
    CLUSTER_ENTITY_DATA_KEY,
  )) as Entity;

  const client = new RbacAuthorizationClient(config);
  await client.iterateClusterRoleBindings(async (clusterRoleBinding) => {
    const clusterRoleBindingEntity = createClusterRoleBindingEntity(
      clusterRoleBinding,
    );
    await jobState.addEntity(clusterRoleBindingEntity);

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.CONTAINS,
        from: clusterEntity,
        to: clusterRoleBindingEntity,
        properties: {
          _type: 'kube_cluster_contains_cluster_role_binding',
        },
      }),
    );
  });
}

export const clusterRoleBindingsSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.ROLES,
    name: 'Fetch Roles',
    entities: [Entities.ROLE],
    relationships: [Relationships.NAMESPACE_CONTAINS_ROLE],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchRoles,
    permissions: [
      {
        apiGroups: ['rbac.authorization.k8s.io'],
        resources: ['roles'],
        verbs: ['list'],
      },
    ],
  },
  {
    id: IntegrationSteps.CLUSTER_ROLES,
    name: 'Fetch Cluster Roles',
    entities: [Entities.CLUSTER_ROLE],
    relationships: [Relationships.CLUSTER_CONTAINS_CLUSTER_ROLE],
    dependsOn: [IntegrationSteps.CLUSTERS],
    executionHandler: fetchClusterRoles,
    permissions: [
      {
        apiGroups: ['rbac.authorization.k8s.io'],
        resources: ['clusterroles'],
        verbs: ['list'],
      },
    ],
  },
  {
    id: IntegrationSteps.ROLE_BINDINGS,
    name: 'Fetch Role Bindings',
    entities: [Entities.ROLE_BINDING],
    relationships: [Relationships.NAMESPACE_CONTAINS_ROLE_BINDING],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchRoleBindings,
    permissions: [
      {
        apiGroups: ['rbac.authorization.k8s.io'],
        resources: ['rolebindings'],
        verbs: ['list'],
      },
    ],
  },
  {
    id: IntegrationSteps.CLUSTER_ROLE_BINDINGS,
    name: 'Fetch Cluster Role Bindings',
    entities: [Entities.CLUSTER_ROLE_BINDING],
    relationships: [Relationships.CLUSTER_CONTAINS_CLUSTER_ROLE_BINDING],
    dependsOn: [IntegrationSteps.CLUSTERS],
    executionHandler: fetchClusterRoleBindings,
    permissions: [
      {
        apiGroups: ['rbac.authorization.k8s.io'],
        resources: ['clusterrolebindings'],
        verbs: ['list'],
      },
    ],
  },
];
