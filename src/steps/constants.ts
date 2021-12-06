import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const CLUSTER_ENTITY_DATA_KEY = 'entity:cluster';

export enum IntegrationSteps {
  NETWORK_POLICIES = 'fetch-network-policies',
  POD_SECURITY_POLICIES = 'fetch-pod-security-policies',
  SERVICE_ACCOUNTS = 'fetch-service-accounts',
  ROLES = 'fetch-roles',
  CLUSTER_ROLES = 'fetch-cluster-roles',
  ROLE_BINDINGS = 'fetch-role-bindings',
  CLUSTER_ROLE_BINDINGS = 'fetch-cluster-role-bindings',
  CLUSTERS = 'fetch-clusters',
  BUILD_CLUSTER_RESOURCES_RELATIONSHIPS = 'build-cluster-resources-relationships',
  BUILD_CLUSTER_AKS_RELATIONSHIPS = 'build-cluster-aks-relationships',
  BUILD_CLUSTER_GKE_RELATIONSHIPS = 'build-cluster-gke-relationships',
  NAMESPACES = 'fetch-namespaces',
  NODES = 'fetch-nodes',
  SERVICES = 'fetch-services',
  DEPLOYMENTS = 'fetch-deployments',
  BUILD_CONTAINER_SPEC_VOLUME_RELATIONSHIPS = 'build-container-spec-volume-relationships',
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
  | 'NETWORK_POLICY'
  | 'POD_SECURITY_POLICY'
  | 'SERVICE_ACCOUNT'
  | 'ROLE'
  | 'CLUSTER_ROLE'
  | 'ROLE_BINDING'
  | 'CLUSTER_ROLE_BINDING'
  | 'CLUSTER'
  | 'AZURE_KUBERNETES_CLUSTER'
  | 'GOOGLE_KUBERNETES_CLUSTER'
  | 'NAMESPACE'
  | 'NODE'
  | 'SERVICE'
  | 'DEPLOYMENT'
  | 'CONTAINER_SPEC'
  | 'VOLUME'
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
  NETWORK_POLICY: {
    _type: 'kube_network_policy',
    _class: ['Configuration'],
    resourceName: 'Kubernetes Network Policy',
  },
  POD_SECURITY_POLICY: {
    _type: 'kube_pod_security_policy',
    _class: ['Configuration'],
    resourceName: 'Kubernetes Pod Security Policy',
  },
  SERVICE_ACCOUNT: {
    _type: 'kube_service_account',
    _class: ['User'],
    resourceName: 'Kubernetes Service Account',
  },
  ROLE: {
    _type: 'kube_role',
    _class: ['AccessRole'],
    resourceName: 'Kubernetes Role',
  },
  CLUSTER_ROLE: {
    _type: 'kube_cluster_role',
    _class: ['AccessRole'],
    resourceName: 'Kubernetes Cluster Role',
  },
  ROLE_BINDING: {
    _type: 'kube_role_binding',
    _class: ['AccessPolicy'],
    resourceName: 'Kubernetes Role Binding',
  },
  CLUSTER_ROLE_BINDING: {
    _type: 'kube_cluster_role_binding',
    _class: ['AccessPolicy'],
    resourceName: 'Kubernetes Cluster Role Binding',
  },
  CLUSTER: {
    _type: 'kube_cluster',
    _class: ['Cluster'],
    resourceName: 'Kubernetes Cluster',
  },
  AZURE_KUBERNETES_CLUSTER: {
    _type: 'azure_kubernetes_cluster',
    _class: ['Cluster'],
    resourceName: 'Azure Kubernetes Cluster',
  },
  GOOGLE_KUBERNETES_CLUSTER: {
    _type: 'google_container_cluster',
    _class: ['Cluster'],
    resourceName: 'Google Kubernetes Cluster',
  },
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
  CONTAINER_SPEC: {
    _type: 'kube_container_spec',
    _class: ['Configuration'],
    resourceName: 'Kubernetes Container Spec',
  },
  VOLUME: {
    _type: 'kube_volume',
    _class: ['Disk'],
    resourceName: 'Kubernetes Volume',
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
  | 'CLUSTER_CONTAINS_POD_SECURITY_POLICY'
  | 'CLUSTER_CONTAINS_NAMESPACE'
  | 'CLUSTER_CONTAINS_CLUSTER_ROLE'
  | 'CLUSTER_CONTAINS_CLUSTER_ROLE_BINDING'
  | 'CLUSTER_IS_AKS_CLUSTER'
  | 'CLUSTER_IS_GKE_CLUSTER'
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
  | 'NAMESPACE_CONTAINS_NETWORK_POLICY'
  | 'NAMESPACE_CONTAINS_SERVICE_ACCOUNT'
  | 'NAMESPACE_CONTAINS_ROLE'
  | 'NAMESPACE_CONTAINS_ROLE_BINDING'
  | 'DEPLOYMENT_MANAGES_REPLICASET'
  | 'DEPLOYMENT_USES_CONTAINER_SPEC'
  | 'CONTAINER_SPEC_USES_VOLUME'
  | 'REPLICASET_MANAGES_POD'
  | 'STATEFULSET_MANAGES_POD'
  | 'CRONJOB_MANAGES_JOB'
  | 'JOB_MANAGES_POD'
  | 'NODE_HAS_POD'
  | 'POD_CONTAINS_CONTAINER',
  StepRelationshipMetadata
> = {
  CLUSTER_CONTAINS_POD_SECURITY_POLICY: {
    _type: 'kube_cluster_contains_pod_security_policy',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.POD_SECURITY_POLICY._type,
  },
  CLUSTER_CONTAINS_NAMESPACE: {
    _type: 'kube_cluster_contains_namespace',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.NAMESPACE._type,
  },
  CLUSTER_CONTAINS_CLUSTER_ROLE: {
    _type: 'kube_cluster_contains_cluster_role',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.CLUSTER_ROLE._type,
  },
  CLUSTER_CONTAINS_CLUSTER_ROLE_BINDING: {
    _type: 'kube_cluster_contains_cluster_role_binding',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.CLUSTER_ROLE_BINDING._type,
  },
  CLUSTER_IS_AKS_CLUSTER: {
    _type: 'kube_cluster_is_azure_kubernetes_cluster',
    _class: RelationshipClass.IS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.AZURE_KUBERNETES_CLUSTER._type,
  },
  CLUSTER_IS_GKE_CLUSTER: {
    _type: 'kube_cluster_is_google_container_cluster',
    _class: RelationshipClass.IS,
    sourceType: Entities.CLUSTER._type,
    targetType: Entities.GOOGLE_KUBERNETES_CLUSTER._type,
  },
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
  NAMESPACE_CONTAINS_NETWORK_POLICY: {
    _type: 'kube_namespace_contains_network_policy',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.NETWORK_POLICY._type,
  },
  NAMESPACE_CONTAINS_SERVICE_ACCOUNT: {
    _type: 'kube_namespace_contains_service_account',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.SERVICE_ACCOUNT._type,
  },
  NAMESPACE_CONTAINS_ROLE: {
    _type: 'kube_namespace_contains_role',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.ROLE._type,
  },
  NAMESPACE_CONTAINS_ROLE_BINDING: {
    _type: 'kube_namespace_contains_role_binding',
    _class: RelationshipClass.CONTAINS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.ROLE_BINDING._type,
  },
  DEPLOYMENT_MANAGES_REPLICASET: {
    _type: 'kube_deployment_manages_replica_set',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.DEPLOYMENT._type,
    targetType: Entities.REPLICASET._type,
  },
  DEPLOYMENT_USES_CONTAINER_SPEC: {
    _type: 'kube_deployment_uses_container_spec',
    _class: RelationshipClass.USES,
    sourceType: Entities.DEPLOYMENT._type,
    targetType: Entities.CONTAINER_SPEC._type,
  },
  CONTAINER_SPEC_USES_VOLUME: {
    _type: 'kube_container_spec_uses_volume',
    _class: RelationshipClass.USES,
    sourceType: Entities.CONTAINER_SPEC._type,
    targetType: Entities.VOLUME._type,
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
