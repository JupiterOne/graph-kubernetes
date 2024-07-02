import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { V1DaemonSet } from '@kubernetes/client-node';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createDaemonSetEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import {
  createContainerSpecEntity,
  getContainerSpecKey,
} from '../deployments/converters';

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
              namespaceEntity.name as string,
              container,
            );
            // Check if the entity is already present in jobState
            if (jobState.hasKey(daemonSetContainerspecEntity._key)) {
              continue;
            }
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
      _type: Entities.NAMESPACE._type,
    },
    async (namespaceEntity) => {
      await jobState.iterateEntities(
        {
          _type: Entities.DAEMONSET._type,
        },
        async (daemonSetEntity) => {
          const rawNode = getRawData<V1DaemonSet>(daemonSetEntity);
          const daemonSetContainers = rawNode?.spec?.template?.spec?.containers;

          if (daemonSetContainers) {
            for (const container of daemonSetContainers) {
              const containerSpecKey = getContainerSpecKey(
                namespaceEntity.name as string,
                container.name,
              );

              if (!containerSpecKey) {
                throw new IntegrationMissingKeyError(
                  `Cannot build Relationship.
                  Error: Missing Key.
                  containerSpecKey: ${containerSpecKey}`,
                );
              }

              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.USES,
                  toKey: containerSpecKey,
                  toType: Entities.CONTAINER_SPEC._type,
                  fromKey: daemonSetEntity._key,
                  fromType: Entities.DAEMONSET._type,
                }),
              );
            }
          }
        },
      );
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
    name: 'Build Daemmonset USES Container Spec relationship',
    entities: [],
    relationships: [Relationships.DAEMONSET_USES_CONTAINER_SPEC],
    dependsOn: [IntegrationSteps.DAEMONSETS],
    executionHandler: buildContainerSpecDaemonsetRelationship,
  },
];
