import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

function convertToString(value?: object) {
  if (!value) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return JSON.stringify(value);
  }

  return value;
}

export function createDeploymentEntity(data: k8s.V1Deployment) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.DEPLOYMENT._class,
        _type: Entities.DEPLOYMENT._type,
        // metadata properties
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties
        minReadySeconds: data.spec?.minReadySeconds,
        paused: data.spec?.paused,
        progressDeadlineSeconds: data.spec?.progressDeadlineSeconds,
        replicas: data.spec?.replicas,
        revisionHistoryLimit: data.spec?.revisionHistoryLimit,
        'strategy.type': data.spec?.strategy?.type,
        'strategy.maxSurge': convertToString(
          data.spec?.strategy?.rollingUpdate?.maxSurge,
        ),
        'strategy.maxUnavailable': convertToString(
          data.spec?.strategy?.rollingUpdate?.maxUnavailable,
        ),
        // TODO: something about spec.template sections maybe?
        'status.availableReplicas': data.status?.availableReplicas,
        'status.collisionCount': data.status?.collisionCount,
        'status.observedGeneration': data.status?.observedGeneration,
        'status.readyReplicas': data.status?.readyReplicas,
        'status.replicas': data.status?.replicas,
        'status.unavailableReplicas': data.status?.unavailableReplicas,
        'status.updatedReplicas': data.status?.updatedReplicas,
      },
    },
  });
}
