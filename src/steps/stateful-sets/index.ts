import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { ContainerspecType, Entities, IntegrationSteps, Relationships } from '../constants';
import { createStatefulSetEntity } from './converters';
import * as k8s from '@kubernetes/client-node';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import { createContainerSpecEntity } from '../deployments/converters';

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

          for (const container of statefulSet.spec?.template?.spec?.containers || []) {
            const statefulSetContainerspecEntity = createContainerSpecEntity(ContainerspecType.STATEFULSET, container)
            await jobState.addEntity(statefulSetContainerspecEntity);
          }
        },
      );
    },
  );
}

export async function buildContainerSpecStatefulSetRelationship(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;
  await jobState.iterateEntities(
    {
      _type: Entities.STATEFULSET._type,
    },
    async (statefulSetEntity) => {
      const rawNode = getRawData<k8s.V1StatefulSet>(statefulSetEntity);
      const statefulContainer = rawNode?.spec?.template?.spec?.containers;
      if (statefulContainer) {
        for (const container of statefulContainer) {
          const containerSpecKey = ContainerspecType.STATEFULSET + "/" + container.name as string;

          if (!containerSpecKey) {
            throw new IntegrationMissingKeyError(
              `Cannot build Relationship.
              Error: Missing Key.
              containerSpecKey : ${containerSpecKey}`,
            );
          }
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              fromKey: containerSpecKey,
              fromType: Entities.CONTAINER_SPEC._type,
              toKey: statefulSetEntity._key,
              toType: Entities.STATEFULSET._type,
            }),
          );
        }
      }
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
  },
  {
    id: IntegrationSteps.CONTAINER_SPEC_HAS_STATEFULSET,
    name: 'Build Container Spec HAS Statefulset relationship',
    entities: [],
    relationships: [
      Relationships.CONTAINER_SPEC_HAS_STATEFULSET,
    ],
    dependsOn: [IntegrationSteps.STATEFULSETS],
    executionHandler: buildContainerSpecStatefulSetRelationship,
  },
];
