import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createNodeEntity } from './converters';
import { cacheNodeNameToUid } from '../../util/jobState';

export async function fetchNodes(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new CoreClient(config);

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
