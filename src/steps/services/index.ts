import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createServiceEntity } from './converters';

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
              _class: RelationshipClass.HAS,
              from: namespaceEntity,
              to: serviceEntity,
            }),
          );
        },
      );
    },
  );
}

export const serviceSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.SERVICES,
    name: 'Fetch Services',
    entities: [Entities.SERVICE],
    relationships: [Relationships.NAMESPACE_HAS_SERVICE],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchServices,
  },
];
