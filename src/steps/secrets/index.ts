import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createSecretEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchSecrets(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

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

export const secretsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.SECRETS,
    name: 'Fetch Secrets',
    entities: [Entities.SECRET],
    relationships: [Relationships.NAMESPACE_CONTAINS_SECRET],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchSecrets,
  },
];
