import {
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createServiceAccountEntity, createUserEntity } from './converters';
import { KubernetesIntegrationStep } from '../../types';

export async function fetchServiceAccounts(
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

  const client = new CoreClient(config);

  await client.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
  });
}

export const subjectsSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.SERVICE_ACCOUNTS,
    name: 'Fetch Service Accounts',
    entities: [Entities.SERVICE_ACCOUNT],
    relationships: [Relationships.NAMESPACE_CONTAINS_SERVICE_ACCOUNT],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchServiceAccounts,
    permissions: [
      {
        apiGroups: [''],
        resources: ['serviceaccounts'],
        verbs: ['list'],
      },
    ],
  },
  {
    id: IntegrationSteps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
    permissions: [
      {
        apiGroups: [''],
        resources: ['users'],
        verbs: ['list'],
      },
    ],
  },
];
