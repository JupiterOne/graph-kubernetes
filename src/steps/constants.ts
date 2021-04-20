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
    _class: ['Configuration'],
    resourceName: 'Kubernetes Deployment',
  },
  REPLICASET: {
    _type: 'kube_replicaset',
    _class: ['Configuration'],
    resourceName: 'Kubernetes ReplicaSet',
  },
  NODE: {
    _type: 'kube_node',
    _class: ['Group'],
    resourceName: 'Kubernetes Node',
  },
  POD: {
    _type: 'kube_pod',
    _class: ['Group'],
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
  | 'NAMESPACE_HAS_POD'
  | 'NAMESPACE_HAS_SERVICE'
  | 'NAMESPACE_HAS_DEPLOYMENT'
  | 'DEPLOYMENT_HAS_REPLICASET'
  | 'REPLICASET_HAS_POD'
  | 'NODE_HAS_POD'
  | 'POD_HAS_CONTAINER',
  StepRelationshipMetadata
> = {
  NAMESPACE_HAS_POD: {
    _type: 'kube_namespace_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.POD._type,
  },
  NAMESPACE_HAS_SERVICE: {
    _type: 'kube_namespace_has_service',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.SERVICE._type,
  },
  NAMESPACE_HAS_DEPLOYMENT: {
    _type: 'kube_namespace_has_deployment',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NAMESPACE._type,
    targetType: Entities.DEPLOYMENT._type,
  },
  DEPLOYMENT_HAS_REPLICASET: {
    _type: 'kube_deployment_has_replicaset',
    _class: RelationshipClass.HAS,
    sourceType: Entities.DEPLOYMENT._type,
    targetType: Entities.REPLICASET._type,
  },
  REPLICASET_HAS_POD: {
    _type: 'kube_replicaset_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.REPLICASET._type,
    targetType: Entities.POD._type,
  },
  NODE_HAS_POD: {
    _type: 'kube_node_has_pod',
    _class: RelationshipClass.HAS,
    sourceType: Entities.NODE._type,
    targetType: Entities.POD._type,
  },
  POD_HAS_CONTAINER: {
    _type: 'kube_pod_has_container',
    _class: RelationshipClass.HAS,
    sourceType: Entities.POD._type,
    targetType: Entities.CONTAINER._type,
  },
};
