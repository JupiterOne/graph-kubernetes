import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createServiceAccountEntity, createUserEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchServiceAccounts(
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
      await client.iterateNamespacedServiceAccounts(
        namespaceEntity.name as string,
        async (serviceAccount) => {
          const serviceAccountEntity = createServiceAccountEntity(
            serviceAccount,
          );
          await jobState.addEntity(serviceAccountEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: serviceAccountEntity,
            }),
          );
        },
      );
    },
  );
}

export async function fetchUsers(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

  await client.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
  });
}

export const subjectsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.SERVICE_ACCOUNTS,
    name: 'Fetch Service Accounts',
    entities: [Entities.SERVICE_ACCOUNT],
    relationships: [Relationships.NAMESPACE_CONTAINS_SERVICE_ACCOUNT],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchServiceAccounts,
  },
  {
    id: IntegrationSteps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
];
