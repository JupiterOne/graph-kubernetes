import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { CoreClient } from '../../kubernetes/clients/core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import {
  createContainerEntity,
  createPodEntity,
  getContainerKey,
} from './converters';

export async function fetchPods(
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
      await client.iterateNamespacedPods(
        namespaceEntity.name as string,
        async (pod) => {
          const podEntity = createPodEntity(pod);
          await jobState.addEntity(podEntity);

          for (const container of pod.spec?.containers || []) {
            const containerEntity = createContainerEntity(container);
            if (!(await jobState.findEntity(getContainerKey(container.name)))) {
              await jobState.addEntity(containerEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.HAS,
                  from: podEntity,
                  to: containerEntity,
                }),
              );
            }
          }

          const nodeUid = (await jobState.getData(
            `node:${pod.spec?.nodeName}`,
          )) as string;

          const nodeEntity = await jobState.findEntity(nodeUid);
          if (nodeEntity) {
            await jobState.addRelationship(
              createDirectRelationship({
                _class: RelationshipClass.HAS,
                from: nodeEntity,
                to: podEntity,
              }),
            );
          }

          for (const owner of pod.metadata?.ownerReferences || []) {
            const ownerEntity = await jobState.findEntity(owner.uid);
            // So far, to my knowledge, Pod's owners are ReplicaSets
            // This check is here if we later find out other scenarios, so we can just add more relationships
            if (ownerEntity && owner.kind === 'ReplicaSet') {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.HAS,
                  from: ownerEntity,
                  to: podEntity,
                }),
              );
            }
          }
        },
      );
    },
  );
}

export const podsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.PODS,
    name: 'Fetch Pods',
    entities: [Entities.POD, Entities.CONTAINER],
    relationships: [
      Relationships.NODE_HAS_POD,
      Relationships.POD_HAS_CONTAINER,
      Relationships.REPLICASET_HAS_POD,
    ],
    dependsOn: [
      IntegrationSteps.NAMESPACES,
      IntegrationSteps.NODES,
      IntegrationSteps.REPLICASETS,
    ],
    executionHandler: fetchPods,
  },
];
