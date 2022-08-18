import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createSecretEntity(configMap: k8s.V1Secret) {
  // Secret contains a data which we don't want to ingest.
  const { data, ...withoutData } = configMap;

  return createIntegrationEntity({
    entityData: {
      source: withoutData,
      assign: {
        _class: Entities.SECRET._class,
        _type: Entities.SECRET._type,
        _key: withoutData.metadata!.uid!,
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
        type: withoutData.type,
        classification: null,
        encrypted: false,
      },
    },
  });
}
