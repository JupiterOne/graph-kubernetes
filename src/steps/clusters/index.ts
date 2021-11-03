import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
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
];
