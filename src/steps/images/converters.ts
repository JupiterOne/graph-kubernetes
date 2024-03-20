import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';
export function createContainerImageEntity(data: k8s.V1ContainerImage) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.IMAGE._class,
        _type: Entities.IMAGE._type,
        _key: data.names![0],
        names: data.names,
        name: data.names![0],
        sizeInBytes: data.sizeBytes,
      },
    },
  });
}
