import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createNodeEntity } from './converters';
import { cacheNodeNameToUid } from '../../util/jobState';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchNodes(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

  await client.iterateNodes(async (node) => {
    const nodeEntity = createNodeEntity(node);
    await jobState.addEntity(nodeEntity);
    await cacheNodeNameToUid(jobState, node);
  });
}

export const nodeSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.NODES,
    name: 'Fetch Nodes',
    entities: [Entities.NODE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchNodes,
  },
];
