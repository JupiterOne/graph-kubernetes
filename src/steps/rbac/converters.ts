import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createRoleEntity(data: k8s.V1Role) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ROLE._class,
        _type: Entities.ROLE._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        namespace: data.metadata?.namespace,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
      },
    },
  });
}

export function createClusterRoleEntity(data: k8s.V1ClusterRole) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CLUSTER_ROLE._class,
        _type: Entities.CLUSTER_ROLE._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
      },
    },
  });
}

export function createRoleBindingEntity(data: k8s.V1RoleBinding) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ROLE_BINDING._class,
        _type: Entities.ROLE_BINDING._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
      },
    },
  });
}

export function createClusterRoleBindingEntity(data: k8s.V1ClusterRoleBinding) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CLUSTER_ROLE_BINDING._class,
        _type: Entities.CLUSTER_ROLE_BINDING._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
      },
    },
  });
}
