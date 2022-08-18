import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createReplicaSetEntity(data: k8s.V1ReplicaSet) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.REPLICASET._class,
        _type: Entities.REPLICASET._type,
        // metadata properties
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties
        minReadySeconds: data.spec?.minReadySeconds,
        replicas: data.spec?.replicas,
        // TODO: something about spec.template sections maybe?
        'status.availableReplicas': data.status?.availableReplicas,
        'status.fullyLabeledReplicas': data.status?.fullyLabeledReplicas,
        'status.observedGeneration': data.status?.observedGeneration,
        'status.readyReplicas': data.status?.readyReplicas,
        'status.replicas': data.status?.replicas,
      },
    },
  });
}
