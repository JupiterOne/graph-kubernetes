import {
  createDirectRelationship,
  createMappedRelationship,
  Entity,
  IntegrationStep,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { V1ConfigMap } from '@kubernetes/client-node';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  CLUSTER_ENTITY_DATA_KEY,
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { createClusterEntity } from './converters';

export async function fetchClusterDetails(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { name, id } = instance;

  const clusterEntity = createClusterEntity(name, id);

  await jobState.addEntity(clusterEntity);
  await jobState.setData(CLUSTER_ENTITY_DATA_KEY, clusterEntity);
}

export async function buildClusterResourcesRelationships(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  const clusterEntity = (await jobState.getData(
    CLUSTER_ENTITY_DATA_KEY,
  )) as Entity;

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.CONTAINS,
          from: clusterEntity,
          to: namespaceEntity,
        }),
      );
    },
  );
}

function checkForAzureClusterAndReturnKey(data: Entity): null | string {
  if (!data._rawData || data._rawData?.length < 1) {
    return null;
  }

  // Lets turn this into V1ConfigMap as soon as possible so we have typings
  const configMap = data._rawData[0].rawData as V1ConfigMap;
  if (!configMap.metadata || !configMap.metadata.annotations) {
    return null;
  }

  const mustHaveProperties = [
    'subscriptions',
    'resourceGroups',
    'providers',
    'Microsoft.ContainerService',
    'managedClusters',
  ];

  for (const [_, value] of Object.entries(configMap.metadata.annotations)) {
    const annotationData = JSON.parse(value);
    const potentialKey: string = annotationData['data']['CLUSTER_RESOURCE_ID'];
    if (!potentialKey) {
      continue;
    }

    const keyPieces = potentialKey.split('/');
    if (mustHaveProperties.every((property) => keyPieces.includes(property))) {
      return potentialKey;
    }
  }

  return null;
}

export async function buildClusterCloudProviderRelationships(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  const clusterEntity = (await jobState.getData(
    CLUSTER_ENTITY_DATA_KEY,
  )) as Entity;

  await jobState.iterateEntities(
    {
      _type: Entities.CONFIGMAP._type,
    },
    async (configMapEntity) => {
      const azureKubernetesClusterKey = checkForAzureClusterAndReturnKey(
        configMapEntity,
      );
      if (azureKubernetesClusterKey) {
        await jobState.addRelationship(
          createMappedRelationship({
            _class: RelationshipClass.IS,
            _type: Relationships.CLUSTER_IS_AKS_CLUSTER._type,
            _mapping: {
              relationshipDirection: RelationshipDirection.FORWARD,
              sourceEntityKey: clusterEntity._key,
              targetFilterKeys: [['_type', '_key']],
              skipTargetCreation: true,
              targetEntity: {
                _type: Entities.CLUSTER._type,
                _key: azureKubernetesClusterKey,
              },
            },
          }),
        );
      }
    },
  );
}

export const clustersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CLUSTERS,
    name: 'Fetch Cluster',
    entities: [Entities.CLUSTER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchClusterDetails,
  },
  {
    id: IntegrationSteps.BUILD_CLUSTER_RESOURCES_RELATIONSHIPS,
    name: 'Build Cluster Resources Relationships',
    entities: [],
    relationships: [Relationships.CLUSTER_CONTAINS_NAMESPACE],
    dependsOn: [IntegrationSteps.CLUSTERS, IntegrationSteps.NAMESPACES],
    executionHandler: buildClusterResourcesRelationships,
  },
  {
    id: IntegrationSteps.BUILD_CLUSTER_CLOUD_PROVIDERS_RELATIONSHIPS,
    name: 'Build Cluster Cloud Providers Relationships',
    entities: [],
    relationships: [Relationships.CLUSTER_IS_AKS_CLUSTER],
    dependsOn: [IntegrationSteps.CLUSTERS, IntegrationSteps.CONFIGMAPS],
    executionHandler: buildClusterCloudProviderRelationships,
  },
];
