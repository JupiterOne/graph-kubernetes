import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createServiceAccountEntity } from './converters';

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
      await client.iterateNamespacedServiceAccounts(namespaceEntity.name as string,
        async (serviceAccount) => {
          const serviceAccountEntity = createServiceAccountEntity(serviceAccount);
          await jobState.addEntity(serviceAccountEntity);
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: serviceAccountEntity,
            }),
          )
      })
    }
  );
}

export const subjectsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.SERVICE_ACCOUNTS,
    name: 'Fetch Service Accounts',
    entities: [
      Entities.SERVICE_ACCOUNT
    ],
    relationships: [
      Relationships.NAMESPACE_CONTAINS_SERVICE_ACCOUNT,
    ],
    dependsOn: [
      IntegrationSteps.NAMESPACES,
    ],
    executionHandler: fetchServiceAccounts,
  },
];
