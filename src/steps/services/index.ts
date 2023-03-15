import {
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createServiceEntity } from './converters';
import { KubernetesIntegrationStep } from '../../types';

export async function fetchServices(
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
      await client.iterateNamespacedServices(
        namespaceEntity.name as string,
        async (service) => {
          const serviceEntity = createServiceEntity(service);
          await jobState.addEntity(serviceEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: serviceEntity,
            }),
          );
        },
      );
    },
  );
}

export const serviceSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.SERVICES,
    name: 'Fetch Services',
    entities: [Entities.SERVICE],
    relationships: [Relationships.NAMESPACE_CONTAINS_SERVICE],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchServices,
    permissions: [
      {
        apiGroups: [''],
        resources: ['services'],
        verbs: ['list'],
      },
    ],
  },
];
