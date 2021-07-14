import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createConfigMapEntity(configMap: k8s.V1ConfigMap) {
  /*
    ConfigMap contains 2 fields - data and binary data.
    They expose the actual data that's stored inside the map.
    We probably don't want to store this in _rawData
      1) Could be big (?)
      2) User may store something sensitive inside (even though that'd be against ConfigMap recommended use)
  */
  const { binaryData, data, ...withoutData } = configMap;

  return createIntegrationEntity({
    entityData: {
      source: withoutData,
      assign: {
        _class: Entities.CONFIGMAP._class,
        _type: Entities.CONFIGMAP._type,
        _key: withoutData.metadata?.uid,
        name: withoutData.metadata?.name,
        displayName: withoutData.metadata?.name,
        generation: withoutData.metadata?.generation,
        deletionGracePeriodSeconds:
          withoutData.metadata?.deletionGracePeriodSeconds,
        resourceVersion: withoutData.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(
          withoutData.metadata?.creationTimestamp,
        ),
        deletedOn: parseTimePropertyValue(
          withoutData.metadata?.deletionTimestamp,
        ),
        // spec fields
        immutable: withoutData.immutable,
        classification: null,
        encrypted: false,
      },
    },
  });
}
