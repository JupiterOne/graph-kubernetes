import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { createStatefulSetEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchStatefulSets(
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
      await client.iterateStatefulSets(
        namespaceEntity.name as string,
        async (statefulSet) => {
          const statefulSetEntity = createStatefulSetEntity(statefulSet);
          await jobState.addEntity(statefulSetEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: statefulSetEntity,
            }),
          );
        },
      );
    },
  );
}

export const statefulSetsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.STATEFULSETS,
    name: 'Fetch StatefulSets',
    entities: [Entities.STATEFULSET, Entities.CONTAINER_SPEC],
    relationships: [
      Relationships.NAMESPACE_CONTAINS_STATEFULSET,
      // If we later figure out that statefulset can be created using deployment
      // Relationships.DEPLOYMENT_HAS_STATEFULSET
    ],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchStatefulSets,
  }
];
