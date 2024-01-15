import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createDaemonSetEntity(data: k8s.V1DaemonSet) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.DAEMONSET._class,
        _type: Entities.DAEMONSET._type,
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        deletedOn: parseTimePropertyValue(data.metadata?.deletionTimestamp),
        // spec fields
        minReadySeconds: data.spec?.minReadySeconds,
        revisionHistoryLimit: data.spec?.revisionHistoryLimit,
        'strategy.type': data.spec?.updateStrategy?.type,
        'strategy.maxUnavailable':
          data.spec?.updateStrategy?.rollingUpdate?.maxUnavailable,
        'status.collisionCount': data.status?.collisionCount,
        'status.currentNumberScheduled': data.status?.currentNumberScheduled,
        'status.desiredNumberScheduled': data.status?.desiredNumberScheduled,
        'status.numberAvailable': data.status?.numberAvailable,
        'status.numberMisscheduled': data.status?.numberMisscheduled,
        'status.numberReady': data.status?.numberReady,
        'status.numberUnavailable': data.status?.numberUnavailable,
        'status.observedGeneration': data.status?.observedGeneration,
        'status.updatedNumberScheduled': data.status?.updatedNumberScheduled,
      },
    },
  });
}
