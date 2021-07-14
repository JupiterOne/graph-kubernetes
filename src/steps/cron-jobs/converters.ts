import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createCronJobEntity(data: k8s.V1beta1CronJob) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CRONJOB._class,
        _type: Entities.CRONJOB._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        deletedOn: parseTimePropertyValue(data.metadata?.deletionTimestamp),
        // spec fields
        concurrencyPolicy: data.spec?.concurrencyPolicy,
        failedJobsHistoryLimit: data.spec?.failedJobsHistoryLimit,
        schedule: data.spec?.schedule,
        startingDeadlineSeconds: data.spec?.startingDeadlineSeconds,
        successfulJobsHistoryLimit: data.spec?.successfulJobsHistoryLimit,
        suspend: data.spec?.suspend,
        'status.lastScheduleTime': parseTimePropertyValue(
          data.status?.lastScheduleTime,
        ),
      },
    },
  });
}
