import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Cluster } from '@kubernetes/client-node';
import { Entities } from '../constants';

function getClusterKey(id: string) {
  return `kube_cluster:${id}`;
}

export function createClusterEntity(data: Cluster) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CLUSTER._class,
        _type: Entities.CLUSTER._type,
        _key: getClusterKey(data.name),
        name: data.name,
        displayName: data.name,
        server: data.server,
        skipTlsVerify: data.skipTLSVerify,
        caData: data.caData,
      },
    },
  });
}
