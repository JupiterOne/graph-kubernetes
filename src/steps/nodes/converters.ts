import * as k8s from '@kubernetes/client-node';
import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createNodeEntity(data: k8s.V1Node) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.NODE._class,
        _type: Entities.NODE._type,
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties - we could group them using "spec." notation
        podCIDR: data.spec?.podCIDR,
        podCIDRs: data.spec?.podCIDRs,
        providerID: data.spec?.providerID,
        unschedulable: data.spec?.unschedulable,
        'status.allocatable.cpu':
          data.status?.allocatable && data.status?.allocatable['cpu'],
        'status.allocatable.ephemeral-storage':
          data.status?.allocatable &&
          data.status?.allocatable['ephemeral-storage'],
        'status.allocatable.hugepages-1Gi':
          data.status?.allocatable && data.status?.allocatable['hugepages-1Gi'],
        'status.allocatable.hugepages-2Mi':
          data.status?.allocatable && data.status?.allocatable['hugepages-2Mi'],
        'status.allocatable.memory':
          data.status?.allocatable && data.status?.allocatable['memory'],
        'status.allocatable.pods':
          data.status?.allocatable && data.status?.allocatable['pods'],
        'status.capacity.cpu':
          data.status?.capacity && data.status?.capacity['cpu'],
        'status.capacity.ephemeral-storage':
          data.status?.capacity && data.status?.capacity['ephemeral-storage'],
        'status.capacity.hugepages-1Gi':
          data.status?.capacity && data.status?.capacity['hugepages-1Gi'],
        'status.capacity.hugepages-2Mi':
          data.status?.capacity && data.status?.capacity['hugepages-2Mi'],
        'status.capacity.memory':
          data.status?.capacity && data.status?.capacity['memory'],
        'status.capacity.pods':
          data.status?.capacity && data.status?.capacity['pods'],
        'status.kubeletEndpointPort':
          data.status?.daemonEndpoints?.kubeletEndpoint?.Port,
        'status.nodeInfo.architecture': data.status?.nodeInfo?.architecture,
        'status.nodeInfo.bootID': data.status?.nodeInfo?.bootID,
        'status.nodeInfo.containerRuntimeVersion':
          data.status?.nodeInfo?.containerRuntimeVersion,
        'status.nodeInfo.kernelVersion': data.status?.nodeInfo?.kernelVersion,
        'status.nodeInfo.kubeProxyVersion':
          data.status?.nodeInfo?.kubeProxyVersion,
        'status.nodeInfo.kubeletVersion': data.status?.nodeInfo?.kubeletVersion,
        'status.nodeInfo.machineID': data.status?.nodeInfo?.machineID,
        'status.nodeInfo.operatingSystem':
          data.status?.nodeInfo?.operatingSystem,
        'status.nodeInfo.osImage': data.status?.nodeInfo?.osImage,
        'status.nodeInfo.systemUUID': data.status?.nodeInfo?.systemUUID,
      },
    },
  });
}
