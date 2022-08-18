import {
  createIntegrationEntity,
  Entity,
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
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        username: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        active: true,
      },
    },
  });
}

export type UserSubject = k8s.V1beta1UserSubject & {
  username?: string;
  certFile?: string;
  keyFile?: string;
};

export function createUserEntity(data: UserSubject): Entity {
  return {
    _class: Entities.USER._class,
    _rawData: [
      {
        name: 'default',
        rawData: {
          name: data.name,
          username: data.username,
          certFile: data.certFile,
          keyFile: data.keyFile,
        },
      },
    ],
    _type: Entities.USER._type,
    _key: `kube_user:${data.name}`,
    name: data.name,
    username: data.username || data.name,
    displayName: data.name,
    certFile: data.certFile,
    keyFile: data.keyFile,
    active: true,
  };
}
