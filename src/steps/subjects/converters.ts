import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createServiceAccountEntity(data: k8s.V1ServiceAccount) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.SERVICE_ACCOUNT._class,
        _type: Entities.SERVICE_ACCOUNT._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        username: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
      },
    },
  });
}
