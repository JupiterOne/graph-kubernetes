import {
  createDirectRelationship,
  IntegrationStep,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import {
  createContainerEntity,
  createPodEntity,
  getContainerKey,
} from './converters';
import { getNodeUidFromPod } from '../../util/jobState';
import getOrCreateAPIClient from '../../kubernetes/getOrCreateAPIClient';

export async function fetchPods(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState, logger } = context;
  const { config } = instance;

  const client = getOrCreateAPIClient(config);

  const containerEntityKeys = new Set<string>();
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
            const containerEntityKey = getContainerKey(container.name);

            if (!containerEntityKeys.has(containerEntityKey)) {
              await jobState.addEntity(containerEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.CONTAINS,
                  from: podEntity,
                  to: containerEntity,
                }),
              );
              containerEntityKeys.add(containerEntityKey);
            } else {
              // Temp log to let us know if we encounter some duplicate container names
              logger.trace(
                `Found duplicate container name ${containerEntityKey} for pod ${pod.metadata?.name}`,
              );
            }
          }

          if (pod.spec?.nodeName) {
            const nodeUid = await getNodeUidFromPod(jobState, pod);
            if (nodeUid) {
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
            }
          }

          for (const owner of pod.metadata?.ownerReferences || []) {
            const ownerEntity = await jobState.findEntity(owner.uid);
            // This comment will be kept up to date during development:
            // So far, it seems that pod's owners can be ReplicaSet, StatefulSet & Job
            // This check serves as a safeguard to only let "vetted" relationships pass through
            // Without it, we may create some relationship that we didn't configure below
            if (
              ownerEntity &&
              ['ReplicaSet', 'StatefulSet', 'Job'].includes(owner.kind)
            ) {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.MANAGES,
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
      Relationships.POD_CONTAINS_CONTAINER,
      Relationships.REPLICASET_MANAGES_POD,
      Relationships.STATEFULSET_MANAGES_POD,
      Relationships.JOB_MANAGES_POD,
    ],
    dependsOn: [
      IntegrationSteps.NAMESPACES,
      IntegrationSteps.NODES,
      IntegrationSteps.REPLICASETS,
      IntegrationSteps.STATEFULSETS,
    ],
    executionHandler: fetchPods,
  },
];
