import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createNamespaceEntity } from './converters';
import { KubernetesIntegrationStep } from '../../types';

export async function fetchNamespaces(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new CoreClient(config);

  await client.iterateNamespaces(async (namespace) => {
    const namespaceEntity = createNamespaceEntity(namespace);
    await jobState.addEntity(namespaceEntity);
  });
}

export const namespaceSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.NAMESPACES,
    name: 'Fetch Namespaces',
    entities: [Entities.NAMESPACE],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchNamespaces,
    permissions: [
      {
        apiGroups: [''],
        resources: ['namespaces'],
        verbs: ['list'],
      },
    ],
  },
];
