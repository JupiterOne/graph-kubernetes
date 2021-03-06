import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  NAMESPACES = 'fetch-namespaces',
  NODES = 'fetch-nodes',
  SERVICES = 'fetch-services',
  DEPLOYMENTS = 'fetch-deployments',
  REPLICASETS = 'fetch-replica-sets',
  STATEFULSETS = 'fetch-stateful-sets',
  DAEMONSETS = 'fetch-daemon-sets',
  JOBS = 'fetch-jobs',
  CRONJOBS = 'fetch-cron-jobs',
  CONFIGMAPS = 'fetch-config-maps',
  SECRETS = 'fetch-secrets',
  PODS = 'fetch-pods',
}

export const Entities: Record<
  | 'NAMESPACE'
  | 'NODE'
  | 'SERVICE'
  | 'DEPLOYMENT'
  | 'REPLICASET'
  | 'STATEFULSET'
  | 'DAEMONSET'
  | 'JOB'
  | 'CRONJOB'
  | 'CONFIGMAP'
  | 'SECRET'
  | 'POD'
  | 'CONTAINER',
  StepEntityMetadata
> = {
  NAMESPACE: {
    _type: 'kube_namespace',
    _class: ['Group'],
    resourceName: 'Kubernetes Namespace',
  },
  DEPLOYMENT: {
    _type: 'kube_deployment',
    _class: ['Deployment'],
    resourceName: 'Kubernetes Deployment',
  },
  REPLICASET: {
    _type: 'kube_replica_set',
    _class: ['Deployment'],
    resourceName: 'Kubernetes ReplicaSet',
  },
  STATEFULSET: {
    _type: 'kube_stateful_set',
    _class: ['Deployment'],
    resourceName: 'Kubernetes StatefulSet',
  },
  DAEMONSET: {
    _type: 'kube_daemon_set',
    _class: ['Deployment'],
    resourceName: 'Kubernetes DaemonSet',
  },
  NODE: {
    _type: 'kube_node',
    _class: ['Host'],
    resourceName: 'Kubernetes Node',
  },
  JOB: {
    _type: 'kube_job',
    _class: ['Task'],
    resourceName: 'Kubernetes Job',
  },
  CRONJOB: {
    _type: 'kube_cron_job',
    _class: ['Task'],
    resourceName: 'Kubernetes CronJob',
  },
  CONFIGMAP: {
    _type: 'kube_config_map',
    _class: ['Configuration'],
    resourceName: 'Kubernetes ConfigMap',
  },
  SECRET: {
    _type: 'kube_secret',
    _class: ['Vault'],
    resourceName: 'Kubernetes Secret',
  },
  POD: {
    _type: 'kube_pod',
    _class: ['Task'],
    resourceName: 'Kubernetes Pod',
  },
  CONTAINER: {
    _type: 'kube_container',
    _class: ['Container'],
    resourceName: 'Kubernetes Container',
  },
  SERVICE: {
    _type: 'kube_service',
    _class: ['Service'],
    resourceName: 'Kubernetes Service',
  },
};

export const Relationships: Record<
  | 'NAMESPACE_CONTAINS_POD'
  | 'NAMESPACE_CONTAINS_SERVICE'
  | 'NAMESPACE_CONTAINS_DEPLOYMENT'
  | 'NAMESPACE_CONTAINS_REPLICASET'
  | 'NAMESPACE_CONTAINS_STATEFULSET'
  | 'NAMESPACE_CONTAINS_DAEMONSET'
  | 'NAMESPACE_CONTAINS_CRONJOB'
  | 'NAMESPACE_CONTAINS_JOB'
  | 'NAMESPACE_CONTAINS_CONFIGMAP'
  | 'NAMESPACE_CONTAINS_SECRET'
  | 'DEPLOYMENT_MANAGES_REPLICASET'
  | 'REPLICASET_MANAGES_POD'
  | 'STATEFULSET_MANAGES_POD'
  | 'CRONJOB_MANAGES_JOB'
  | 'JOB_MANAGES_POD'
  | 'NODE_HAS_POD'
  | 'POD_CONTAINS_CONTAINER',
  StepRelationshipMetadata
> = {
  NAMESPACE_CONTAINS_POD: {
    _type: 'kube_namespace_contains_pod',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.POD._type,
  },
  NAMESPACE_CONTAINS_SERVICE: {
    _type: 'kube_namespace_contains_service',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.SERVICE._type,
  },
  NAMESPACE_CONTAINS_DEPLOYMENT: {
    _type: 'kube_namespace_contains_deployment',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.DEPLOYMENT._type,
  },
  NAMESPACE_CONTAINS_REPLICASET: {
    _type: 'kube_namespace_contains_replica_set',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.REPLICASET._type,
  },
  NAMESPACE_CONTAINS_STATEFULSET: {
    _type: 'kube_namespace_contains_stateful_set',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.STATEFULSET._type,
  },
  NAMESPACE_CONTAINS_DAEMONSET: {
    _type: 'kube_namespace_contains_daemon_set',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.DAEMONSET._type,
  },
  NAMESPACE_CONTAINS_CRONJOB: {
    _type: 'kube_namespace_contains_cron_job',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.CRONJOB._type,
  },
  NAMESPACE_CONTAINS_JOB: {
    _type: 'kube_namespace_contains_job',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.JOB._type,
  },
  NAMESPACE_CONTAINS_CONFIGMAP: {
    _type: 'kube_namespace_contains_config_map',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.CONFIGMAP._type,
  },
  NAMESPACE_CONTAINS_SECRET: {
    _type: 'kube_namespace_contains_secret',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.SECRET._type,
  },
  DEPLOYMENT_MANAGES_REPLICASET: {
    _type: 'kube_deployment_manages_replica_set',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.DEPLOYMENT._type,
    targetType: Entities.REPLICASET._type,
  },
  REPLICASET_MANAGES_POD: {
    _type: 'kube_replica_set_manages_pod',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.REPLICASET._type,
    targetType: Entities.POD._type,
  },
  STATEFULSET_MANAGES_POD: {
    _type: 'kube_stateful_set_manages_pod',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.STATEFULSET._type,
    targetType: Entities.POD._type,
  },
  CRONJOB_MANAGES_JOB: {
    _type: 'kube_cron_job_manages_job',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.CRONJOB._type,
    targetType: Entities.JOB._type,
  },
  JOB_MANAGES_POD: {
    _type: 'kube_job_manages_pod',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.JOB._type,
    targetType: Entities.POD._type,
  },
  NODE_HAS_POD: {
    _type: 'kube_node_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NODE._type,
    targetType: Entities.POD._type,
  },
  POD_CONTAINS_CONTAINER: {
    _type: 'kube_pod_contains_container',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.POD._type,
    targetType: Entities.CONTAINER._type,
  },
};
