import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createNamespaceEntity(data: k8s.V1Namespace) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.NAMESPACE._class,
        _type: Entities.NAMESPACE._type,
        // metadata properties
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties
        finalizers: data.spec?.finalizers,
        'status.phase': data.status?.phase,
      },
    },
  });
}
