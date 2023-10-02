import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createNamespaceEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchNamespaces(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

  await client.iterateNamespaces(async (namespace) => {
    const namespaceEntity = createNamespaceEntity(namespace);
    await jobState.addEntity(namespaceEntity);
  });
}

export const namespaceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.NAMESPACES,
    name: 'Fetch Namespaces',
    entities: [Entities.NAMESPACE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchNamespaces,
  },
];
