import { fetchStatefulSets } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchStatefulSets', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchStatefulSets',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchStatefulSets],
      entitySchemaMatchers: [
        {
          _type: Entities.STATEFULSET._type,
          matcher: {
            _class: ['Deployment'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_stateful_set' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
                deletedOn: { type: 'number' },

                podManagementPolicy: { type: 'string' },
                replicas: { type: 'number' },
                revisionHistoryLimit: { type: 'number' },
                serviceName: { type: 'string' },
                'strategy.type': { type: 'string' },
                'strategy.partition': { type: 'number' },
                'status.collisionCount': { type: 'number' },
                'status.currentReplicas': { type: 'number' },
                'status.currentRevision': { type: 'string' },
                'status.observedGeneration': { type: 'number' },
                'status.readyReplicas': { type: 'number' },
                'status.replicas': { type: 'number' },
                'status.updateRevision': { type: 'string' },
                'status.updatedReplicas': { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_STATEFULSET._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_stateful_set' },
              },
            },
          },
        },
      ],
    });
  });
});
