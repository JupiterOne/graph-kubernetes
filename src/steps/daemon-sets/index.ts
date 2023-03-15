import {
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { IntegrationStepContext } from '../../config';
import { AppsClient } from '../../kubernetes/clients/apps';
import { KubernetesIntegrationStep } from '../../types';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createDaemonSetEntity } from './converters';

export async function fetchDaemonSets(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, jobState } = context;
  const { config } = instance;

  const client = new AppsClient(config);

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
        },
      );
    },
  );
}

export const daemonSetsSteps: KubernetesIntegrationStep[] = [
  {
    id: IntegrationSteps.DAEMONSETS,
    name: 'Fetch DaemonSets',
    entities: [Entities.DAEMONSET],
    relationships: [Relationships.NAMESPACE_CONTAINS_DAEMONSET],
    dependsOn: [IntegrationSteps.NAMESPACES],
    executionHandler: fetchDaemonSets,
    permissions: [
      {
        apiGroups: ['apps'],
        resources: ['daemonsets'],
        verbs: ['list'],
      },
    ],
  },
];
