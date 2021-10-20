import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

function getClusterKey(id: string) {
  return `kube_cluster:${id}`;
}

export function createClusterEntity(name: string, id: string) {
  return createIntegrationEntity({
    entityData: {
      source: {
        name,
      },
      assign: {
        _class: Entities.CLUSTER._class,
        _type: Entities.CLUSTER._type,
        _key: getClusterKey(id),
        name: name,
        displayName: name,
      },
    },
  });
}
