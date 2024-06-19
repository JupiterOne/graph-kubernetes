import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { V1DaemonSet } from '@kubernetes/client-node';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  ContainerspecType,
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { createDaemonSetEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import { createContainerSpecEntity } from '../deployments/converters';

export async function fetchDaemonSets(
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
      await client.iterateDaemonSets(
        namespaceEntity.name as string,
        async (daemonSet) => {
          const daemonSetEntity = createDaemonSetEntity(daemonSet);
          await jobState.addEntity(daemonSetEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: daemonSetEntity,
            }),
          );

          for (const container of daemonSet.spec?.template?.spec?.containers ||
            []) {
            const daemonSetContainerspecEntity = createContainerSpecEntity(
              ContainerspecType.DAEMONSET,
              container,
            );
            await jobState.addEntity(daemonSetContainerspecEntity);
          }
        },
      );
    },
  );
}

export async function buildContainerSpecDaemonsetRelationship(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;
  await jobState.iterateEntities(
    {
      _type: Entities.DAEMONSET._type,
    },
    async (daemonSetEntity) => {
      const rawNode = getRawData<V1DaemonSet>(daemonSetEntity);
      const daemonSetContainer = rawNode?.spec?.template?.spec?.containers;
      if (daemonSetContainer) {
        for (const container of daemonSetContainer) {
          const containerSpecKey = (ContainerspecType.DAEMONSET +
            '/' +
            container.name) as string;

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
              toKey: daemonSetEntity._key,
              toType: Entities.DAEMONSET._type,
            }),
          );
        }
      }
    },
  );
}

export const daemonSetsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.DAEMONSETS,
    name: 'Fetch DaemonSets',
    entities: [Entities.DAEMONSET, Entities.CONTAINER_SPEC],
    relationships: [Relationships.NAMESPACE_CONTAINS_DAEMONSET],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchDaemonSets,
  },
  {
    id: IntegrationSteps.CONTAINER_SPEC_HAS_DAEMONSET,
    name: 'Build Container Spec HAS Daemonset relationship',
    entities: [],
    relationships: [Relationships.CONTAINER_SPEC_HAS_DAEMONSET],
    dependsOn: [IntegrationSteps.DAEMONSETS],
    executionHandler: buildContainerSpecDaemonsetRelationship,
  },
];
