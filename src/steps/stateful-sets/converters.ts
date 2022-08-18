import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createStatefulSetEntity(data: k8s.V1StatefulSet) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.STATEFULSET._class,
        _type: Entities.STATEFULSET._type,
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        deletedOn: parseTimePropertyValue(data.metadata?.deletionTimestamp),
        // spec fields
        podManagementPolicy: data.spec?.podManagementPolicy,
        replicas: data.spec?.replicas,
        revisionHistoryLimit: data.spec?.revisionHistoryLimit,
        serviceName: data.spec?.serviceName,
        'strategy.type': data.spec?.updateStrategy?.type,
        'strategy.partition':
          data.spec?.updateStrategy?.rollingUpdate?.partition,

        'status.collisionCount': data.status?.collisionCount,
        'status.currentReplicas': data.status?.currentReplicas,
        'status.currentRevision': data.status?.currentRevision,
        'status.observedGeneration': data.status?.observedGeneration,
        'status.readyReplicas': data.status?.readyReplicas,
        'status.replicas': data.status?.replicas,
        'status.updateRevision': data.status?.updateRevision,
        'status.updatedReplicas': data.status?.updatedReplicas,
      },
    },
  });
}
