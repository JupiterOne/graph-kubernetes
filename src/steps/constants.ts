import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export enum IntegrationSteps {
  NAMESPACES = 'fetch-namespaces',
  REPLICASETS = 'fetch-replica-sets',
  NODES = 'fetch-nodes',
  PODS = 'fetch-pods',
  SERVICES = 'fetch-services',
  DEPLOYMENTS = 'fetch-deployments',
}

export const Entities: Record<
  | 'NAMESPACE'
  | 'NODE'
  | 'SERVICE'
  | 'DEPLOYMENT'
  | 'REPLICASET'
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
    _type: 'kube_replicaset',
    _class: ['Deployment'],
    resourceName: 'Kubernetes ReplicaSet',
  },
  NODE: {
    _type: 'kube_node',
    _class: ['Host'],
    resourceName: 'Kubernetes Node',
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
  | 'DEPLOYMENT_MANAGES_REPLICASET'
  | 'REPLICASET_MANAGES_POD'
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
  DEPLOYMENT_MANAGES_REPLICASET: {
    _type: 'kube_deployment_manages_replicaset',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.DEPLOYMENT._type,
    targetType: Entities.REPLICASET._type,
  },
  REPLICASET_MANAGES_POD: {
    _type: 'kube_replicaset_manages_pod',
    _class: RelationshipClass.MANAGES,
    sourceType: Entities.REPLICASET._type,
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
