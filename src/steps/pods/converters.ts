import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createPodEntity(data: k8s.V1Pod) {
  // TODO: We could remove data.spec.containers array from this (from rawData)
  // TODO: We may want to take the spec.volumes, delete it from here and create new entities/relationships
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.POD._class,
        _type: Entities.POD._type,
        // metadata properties
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties
        activeDeadlineSeconds: data.spec?.activeDeadlineSeconds,
        automountServiceAccountToken: data.spec?.automountServiceAccountToken,
        dnsPolicy: data.spec?.dnsPolicy,
        enableServiceLinks: data.spec?.enableServiceLinks,
        hostIPC: data.spec?.hostIPC,
        hostNetwork: data.spec?.hostNetwork,
        hostPID: data.spec?.hostPID,
        hostname: data.spec?.hostname,
        nodeName: data.spec?.nodeName,
        preemptionPolicy: data.spec?.preemptionPolicy,
        priority: data.spec?.priority,
        priorityClassName: data.spec?.priorityClassName,
        restartPolicy: data.spec?.restartPolicy,
        runtimeClassName: data.spec?.runtimeClassName,
        schedulerName: data.spec?.schedulerName,
        serviceAccount: data.spec?.serviceAccount,
        serviceAccountName: data.spec?.serviceAccountName,
        setHostnameAsFQDN: data.spec?.setHostnameAsFQDN,
        shareProcessNamespace: data.spec?.shareProcessNamespace,
        subdomain: data.spec?.subdomain,
        terminationGracePeriodSeconds: data.spec?.terminationGracePeriodSeconds,
        'status.hostIP': data.status?.hostIP,
        'status.message': data.status?.message,
        'status.nominatedNodeName': data.status?.nominatedNodeName,
        'status.phase': data.status?.phase,
        'status.podIP': data.status?.podIP,
        'status.qosClass': data.status?.qosClass,
        'status.reason': data.status?.reason,
        'status.startTime': parseTimePropertyValue(data.status?.startTime),
      },
    },
  });
}

// TODO: better container key?
// 'Container' is not a Kubernetes resource (the smallest resource is a pod),
// so we don't have the uid for a container. We have uid for pod which is container's
// parent so we could craft a key using it somehow
export function getContainerKey(name: string) {
  return `container:${name}`;
}

// TODO: this isn't pod, but if we're going to break out container data
// off of the pod resource, we may not want to create a different folder just
// to house this converter, or do we?
export function createContainerEntity(data: k8s.V1Container) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CONTAINER._class,
        _type: Entities.CONTAINER._type,
        // minLength issue
        _key: getContainerKey(data.name),
        name: data.name,
        displayName: data.name,
        image: data.image,
        imagePullPolicy: data.imagePullPolicy,
        terminationMessagePath: data.terminationMessagePath,
        terminationMessagePolicy: data.terminationMessagePolicy,
      },
    },
  });
}
