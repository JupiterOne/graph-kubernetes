import {
  createDirectRelationship,
  getRawData,
  IntegrationMissingKeyError,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { V1ReplicaSet } from '@kubernetes/client-node';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createReplicaSetEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';
import {
  createContainerSpecEntity,
  getContainerSpecKey,
} from '../deployments/converters';

export async function fetchReplicaSets(
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
      await client.iterateReplicaSets(
        namespaceEntity.name as string,
        async (replicaSet) => {
          const replicaSetEntity = createReplicaSetEntity(replicaSet);
          await jobState.addEntity(replicaSetEntity);

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.CONTAINS,
              from: namespaceEntity,
              to: replicaSetEntity,
            }),
          );

          for (const owner of replicaSet.metadata?.ownerReferences || []) {
            const ownerEntity = await jobState.findEntity(owner.uid);
            // So far, to my knowledge, ReplicaSets's owners are Deployments
            // This check is here if we later find out other scenarios, so we can just add more relationships
            if (ownerEntity && owner.kind === 'Deployment') {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.MANAGES,
                  from: ownerEntity,
                  to: replicaSetEntity,
                }),
              );
            }
          }
          for (const container of replicaSet.spec?.template?.spec?.containers ||
            []) {
            const replicaSetContainerspecEntity = createContainerSpecEntity(
              namespaceEntity.name as string,
              container,
            );
            // Check if the entity is already present in jobState
            if (jobState.hasKey(replicaSetContainerspecEntity._key)) {
              continue; // Skip to the next iteration if the entity is already present
            }
            await jobState.addEntity(replicaSetContainerspecEntity);

            if (jobState.hasKey(container.image)) {
              await jobState.addRelationship(
                createDirectRelationship({
                  fromKey: replicaSetEntity._key,
                  fromType: replicaSetEntity._type,
                  toKey: container.image!,
                  toType: Entities.IMAGE._type,
                  _class: RelationshipClass.USES,
                }),
              );
            }
          }
        },
      );
    },
  );
}

export async function buildContainerSpecReplicasetRelationship(
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
          _type: Entities.REPLICASET._type,
        },
        async (replicaSetEntity) => {
          const rawNode = getRawData<V1ReplicaSet>(replicaSetEntity);
          const replicaSetContainers =
            rawNode?.spec?.template?.spec?.containers;

          if (replicaSetContainers) {
            for (const container of replicaSetContainers) {
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
                  fromKey: replicaSetEntity._key,
                  fromType: Entities.REPLICASET._type,
                }),
              );
            }
          }
        },
      );
    },
  );
}

export const replicaSetsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.REPLICASETS,
    name: 'Fetch ReplicaSets',
    entities: [Entities.REPLICASET, Entities.CONTAINER_SPEC],
    relationships: [
      Relationships.NAMESPACE_CONTAINS_REPLICASET,
      Relationships.DEPLOYMENT_MANAGES_REPLICASET,
      Relationships.REPLICA_SET_USES_IMAGE,
    ],
    dependsOn: [
      IntegrationSteps.NAMESPACES,
      IntegrationSteps.DEPLOYMENTS,
      IntegrationSteps.IMAGES,
    ],
    executionHandler: fetchReplicaSets,
  },
  {
    id: IntegrationSteps.CONTAINER_SPEC_HAS_REPLICASET,
    name: 'Build Replicaset USES Container Spec relationship',
    entities: [],
    relationships: [Relationships.REPLICASET_USES_CONTAINER_SPEC],
    dependsOn: [IntegrationSteps.REPLICASETS],
    executionHandler: buildContainerSpecReplicasetRelationship,
  },
];
