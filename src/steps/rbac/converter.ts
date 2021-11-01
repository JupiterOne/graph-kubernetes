import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createClusterRoleEntity(data: k8s.V1ClusterRole) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CLUSTER_ROLE._class,
        _type: Entities.CLUSTER_ROLE._type,
        // metadata properties
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        category: ['infrastructure'],
        function: ['compute'],
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
      },
    },
  });
}
