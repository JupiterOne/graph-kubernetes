import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createNetworkPolicyEntity(data: k8s.V1NetworkPolicy) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.NETWORK_POLICY._class,
        _type: Entities.NETWORK_POLICY._type,
        // metadata properties
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec
        // TODO: get egress data (mapping? separate entities? combination?)
        // TODO: get ingress data (mapping? separate entities? combination?)
        policyTypes: data.spec?.policyTypes,
      },
    },
  });
}
