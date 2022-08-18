import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createServiceEntity(data: k8s.V1Service) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.SERVICE._class,
        _type: Entities.SERVICE._type,
        // metadata properties
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        category: ['infrastructure'],
        function: ['compute'],
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties
        allocateLoadBalancerNodePorts: data.spec?.allocateLoadBalancerNodePorts,
        clusterIP: data.spec?.clusterIP,
        clusterIPs: data.spec?.clusterIPs,
        externalIPs: data.spec?.externalIPs,
        externalName: data.spec?.externalName,
        externalTrafficPolicy: data.spec?.externalTrafficPolicy,
        healthCheckNodePort: data.spec?.healthCheckNodePort,
        ipFamilies: data.spec?.ipFamilies,
        ipFamilyPolicy: data.spec?.ipFamilyPolicy,
        loadBalancerIP: data.spec?.loadBalancerIP,
        loadBalancerSourceRanges: data.spec?.loadBalancerSourceRanges,
        publishNotReadyAddresses: data.spec?.publishNotReadyAddresses,
        sessionAffinity: data.spec?.sessionAffinity,
        type: data.spec?.type,
        // TODO: data.status part is made up of arrays, require some mappings/thinking
      },
    },
  });
}
