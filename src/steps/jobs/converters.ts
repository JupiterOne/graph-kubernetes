import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createJobEntity(data: k8s.V1Job) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.JOB._class,
        _type: Entities.JOB._type,
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        deletedOn: parseTimePropertyValue(data.metadata?.deletionTimestamp),
        // spec fields
        activeDeadlineSeconds: data.spec?.activeDeadlineSeconds,
        backoffLimit: data.spec?.backoffLimit,
        completions: data.spec?.completions,
        manualSelector: data.spec?.manualSelector,
        parallelism: data.spec?.parallelism,
        ttlSecondsAfterFinished: data.spec?.ttlSecondsAfterFinished,
        'status.active': data.status?.active,
        'status.startTime': parseTimePropertyValue(data.status?.startTime),
        'status.completionTime': parseTimePropertyValue(
          data.status?.completionTime,
        ),
        'status.failed': data.status?.failed,
        'status.succeeded': data.status?.succeeded,
      },
    },
  });
}
