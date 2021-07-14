import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { CoreClient } from '../../kubernetes/clients/core';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createConfigMapEntity } from './converters';

export async function fetchConfigMaps(
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
      await client.iterateNamespacedConfigMaps(
        namespaceEntity.name as string,
        async (configMap) => {
          const configMapEntity = createConfigMapEntity(configMap);
          await jobState.addEntity(configMapEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: configMapEntity,
            }),
          );
        },
      );
    },
  );
}

export const configMapsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.CONFIGMAPS,
    name: 'Fetch ConfigMaps',
    entities: [Entities.CONFIGMAP],
    relationships: [Relationships.NAMESPACE_CONTAINS_CONFIGMAP],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchConfigMaps,
  },
];
