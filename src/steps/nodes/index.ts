import {
  IntegrationStep,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createNodeEntity } from './converters';
import { cacheNodeNameToUid } from '../../util/jobState';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import { V1Node } from '@kubernetes/client-node';

export async function fetchNodes(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;
  const { config } = instance;
  let nodesWithMissingMetadata = 0;

  const client = getOrCreateAPIClient(config);

  await client.iterateNodes(async (node: V1Node) => {
    if (!node.metadata) {
      nodesWithMissingMetadata++;
      return;
    }
    const nodeEntity = createNodeEntity(node);
    await jobState.addEntity(nodeEntity);
    await cacheNodeNameToUid(jobState, node);
  });

  logger.publishWarnEvent({
    name: IntegrationWarnEventName.IngestionLimitEncountered,
    description: `Found metadata missing for ${nodesWithMissingMetadata} nodes`,
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
