import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  CLUSTER_ENTITY_DATA_KEY,
  Entities,
  IntegrationSteps,
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

export const clustersSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CLUSTERS,
    name: 'Fetch Clusters',
    entities: [Entities.CLUSTER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchClusterDetails,
  },
];
