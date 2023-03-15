import {
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationStepContext } from '../../config';
import { CoreClient } from '../../kubernetes/clients/core';
import { KubernetesIntegrationStep } from '../../types';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createSecretEntity } from './converters';

export async function fetchSecrets(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new CoreClient(config);

  await jobState.iterateEntities(
    {
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await client.iterateNamespacedSecrets(
        namespaceEntity.name as string,
        async (secret) => {
          const secretEntity = createSecretEntity(secret);
          await jobState.addEntity(secretEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: secretEntity,
            }),
          );
        },
      );
    },
  );
}

export const secretsSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.SECRETS,
    name: 'Fetch Secrets',
    entities: [Entities.SECRET],
    relationships: [Relationships.NAMESPACE_CONTAINS_SECRET],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchSecrets,
    permissions: [
      {
        apiGroups: [''],
        resources: ['secrets'],
        verbs: ['list'],
      },
    ],
  },
];
