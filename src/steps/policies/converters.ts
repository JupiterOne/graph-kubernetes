import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';

export function createPodSecurityPolicyEntity(
  data: k8s.V1beta1PodSecurityPolicy,
) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.POD_SECURITY_POLICY._class,
        _type: Entities.POD_SECURITY_POLICY._type,
        // metadata properties
        _key: data.metadata?.uid,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec
        // 5.2.5 Minimize the admission of containers with allowPrivilegeEscalation (Automated)
        allowPrivilegeEscalation: data.spec?.allowPrivilegeEscalation === true,
        // 5.2.8 Minimize the admission of containers with added capabilities (Automated)
        allowedCapabilities: data.spec?.allowedCapabilities,
        allowedProcMountTypes: data.spec?.allowedProcMountTypes,
        allowedUnsafeSysctls: data.spec?.allowedUnsafeSysctls,
        defaultAddCapabilities: data.spec?.defaultAddCapabilities,
        defaultAllowPrivilegeEscalation:
          data.spec?.defaultAllowPrivilegeEscalation,
        forbiddenSysctls: data.spec?.forbiddenSysctls,
        // 5.2.3 Minimize the admission of containers wishing to share the host IPC namespace (Automated)
        hostIPC: data.spec?.hostIPC === true,
        // 5.2.4 Minimize the admission of containers wishing to share the host network namespace (Automated)
        hostNetwork: data.spec?.hostNetwork === true,
        // 5.2.2 Minimize the admission of containers wishing to share the host process ID namespace (Automated)
        hostPID: data.spec?.hostPID === true,
        // 5.2.1 Minimize the admission of privileged containers (Automated)
        privileged: data.spec?.privileged === true,
        readOnlyRootFilesystem: data.spec?.readOnlyRootFilesystem === true,
        // 5.2.7 Minimize the admission of containers with the NET_RAW capability (Automated)
        // 5.2.9 Minimize the admission of containers with capabilities assigned (Manual)
        requiredDropCapabilities: data.spec?.requiredDropCapabilities,
        'runAsGroup.range': data.spec?.runAsGroup?.ranges?.map(
          (range) => `${range.min}, ${range.max}`,
        ),
        'runAsGroup.rule': data.spec?.runAsGroup?.rule,
        'runAsUser.range': data.spec?.runAsUser?.ranges?.map(
          (range) => `${range.min}, ${range.max}`,
        ),
        // 5.2.6 Minimize the admission of root containers (Automated)
        'runAsUser.rule': data.spec?.runAsUser?.rule,
        'runtimeClass.allowedRuntimeClassNames':
          data.spec?.runtimeClass?.allowedRuntimeClassNames,
        'runtimeClass.defaultRuntimeClassName':
          data.spec?.runtimeClass?.defaultRuntimeClassName,
        'seLinux.rule': data.spec?.seLinux.rule,
        'seLinux.seLinuxOptions.level':
          data.spec?.seLinux.seLinuxOptions?.level,
        'seLinux.seLinuxOptions.role': data.spec?.seLinux.seLinuxOptions?.role,
        'seLinux.seLinuxOptions.type': data.spec?.seLinux.seLinuxOptions?.type,
        'seLinux.seLinuxOptions.user': data.spec?.seLinux.seLinuxOptions?.user,
        'supplementalGroups.range': data.spec?.supplementalGroups.ranges?.map(
          (range) => `${range.min}, ${range.max}`,
        ),
        'supplementalGroups.rule': data.spec?.supplementalGroups?.rule,
      },
    },
  });
}

export function createNetworkPolicyEntity(data: k8s.V1NetworkPolicy) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.NETWORK_POLICY._class,
        _type: Entities.NETWORK_POLICY._type,
        // metadata properties
        _key: data.metadata?.uid,
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
