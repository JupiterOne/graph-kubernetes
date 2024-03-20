import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createReplicaSetEntity } from './converters';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

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

export const replicaSetsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.REPLICASETS,
    name: 'Fetch ReplicaSets',
    entities: [Entities.REPLICASET],
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
];
