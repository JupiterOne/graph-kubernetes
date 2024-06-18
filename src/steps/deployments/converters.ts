import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  generateRelationshipKey,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import { Entities } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';
import { V1VolumeMount } from '@kubernetes/client-node';

export function getVolumeKey(
  namespace: string,
  deploymentId: string,
  volumeName: string,
) {
  return `${namespace}/${deploymentId}/${volumeName}`;
}

export function createVolumeEntity(
  namespace: string,
  deploymentUid: string,
  data: k8s.V1Volume,
) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.VOLUME._class,
        _type: Entities.VOLUME._type,
        _key: getVolumeKey(namespace, deploymentUid, data.name),
        name: data.name,
        displayName: data.name,
        'ephemeral.readOnly': data.ephemeral?.['readOnly'],
        'hostPath.path': data.hostPath?.path,
        'hostPath.type': data.hostPath?.type,
        classification: null,
        encrypted: false,
      },
    },
  });
}

export function getContainerSpecKey(
  namespace: string,
  deploymentId: string,
  specName: string,
) {
  return `${namespace}/${deploymentId}/${specName}`;
}

export function createContainerSpecEntity(
  namespace: string,
  deploymentUid: string,
  data: k8s.V1Container,
) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.CONTAINER_SPEC._class,
        _type: Entities.CONTAINER_SPEC._type,
        _key: getContainerSpecKey(namespace, deploymentUid, data.name),
        name: data.name,
        displayName: data.name,
        image: data.image,
        imagePullPolicy: data.imagePullPolicy,
        'securityContext.allowPrivilegeEscalation':
          data.securityContext?.allowPrivilegeEscalation,
        'securityContext.privileged': data.securityContext?.privileged,
        'securityContext.procMount': data.securityContext?.procMount,
        'securityContext.readOnlyRootFilesystem':
          data.securityContext?.readOnlyRootFilesystem,
        'securityContext.runAsGroup': data.securityContext?.runAsGroup,
        'securityContext.runAsNonRoot': data.securityContext?.runAsNonRoot,
        'securityContext.runAsUser': data.securityContext?.runAsUser,
      },
    },
  });
}

export function createDeploymentEntity(data: k8s.V1Deployment) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.DEPLOYMENT._class,
        _type: Entities.DEPLOYMENT._type,
        // metadata properties
        _key: data.metadata!.uid!,
        name: data.metadata?.name,
        displayName: data.metadata?.name,
        generation: data.metadata?.generation,
        deletionGracePeriodSeconds: data.metadata?.deletionGracePeriodSeconds,
        resourceVersion: data.metadata?.resourceVersion,
        createdOn: parseTimePropertyValue(data.metadata?.creationTimestamp),
        // spec properties
        minReadySeconds: data.spec?.minReadySeconds,
        paused: data.spec?.paused,
        progressDeadlineSeconds: data.spec?.progressDeadlineSeconds,
        replicas: data.spec?.replicas,
        revisionHistoryLimit: data.spec?.revisionHistoryLimit,
        'strategy.type': data.spec?.strategy?.type,
        'strategy.maxSurge': data.spec?.strategy?.rollingUpdate?.maxSurge,
        'strategy.maxUnavailable':
          data.spec?.strategy?.rollingUpdate?.maxUnavailable,
        // TODO: something about spec.template sections maybe?
        'status.availableReplicas': data.status?.availableReplicas,
        'status.collisionCount': data.status?.collisionCount,
        'status.observedGeneration': data.status?.observedGeneration,
        'status.readyReplicas': data.status?.readyReplicas,
        'status.replicas': data.status?.replicas,
        'status.unavailableReplicas': data.status?.unavailableReplicas,
        'status.updatedReplicas': data.status?.updatedReplicas,
      },
    },
  });
}

function getUniqueContainerSpecVolumeMountKey(volumeMount: V1VolumeMount) {
  let key = volumeMount.name;

  if (volumeMount.mountPath) {
    key += `/mount_path_${volumeMount.mountPath}`;
  }

  if (volumeMount.subPath) {
    key += `/mount_sub_path_${volumeMount.subPath}`;
  }

  return key;
}

function generateContainerSpecToVolumeRelationshipKey({
  _class,
  containerSpecEntity,
  volumeEntity,
  volumeMount,
}: {
  _class: RelationshipClass;
  containerSpecEntity: Entity;
  volumeEntity: Entity;
  volumeMount: V1VolumeMount;
}) {
  const baseRelationshipKey = generateRelationshipKey(
    _class,
    containerSpecEntity,
    volumeEntity,
  );

  const volumeMountKey = getUniqueContainerSpecVolumeMountKey(volumeMount);
  return `${baseRelationshipKey}/mount_${volumeMountKey}`;
}

export function createContainerSpecToVolumeRelationship({
  containerSpecEntity,
  volumeEntity,
  volumeMount,
}: {
  containerSpecEntity: Entity;
  volumeEntity: Entity;
  volumeMount: V1VolumeMount;
}) {
  return createDirectRelationship({
    _class: RelationshipClass.USES,
    from: containerSpecEntity,
    to: volumeEntity,
    properties: {
      _key: generateContainerSpecToVolumeRelationshipKey({
        _class: RelationshipClass.USES,
        containerSpecEntity,
        volumeEntity,
        volumeMount,
      }),
      readOnly: volumeMount.readOnly,
      mountPath: volumeMount.mountPath,
      mountPropagation: volumeMount.mountPropagation,
      subPath: volumeMount.subPath,
    },
  });
}
