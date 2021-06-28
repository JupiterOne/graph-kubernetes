import { fetchDeployments } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchDeployments', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchDeployments',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchDeployments],
      entitySchemaMatchers: [
        {
          _type: Entities.DEPLOYMENT._type,
          matcher: {
            _class: ['Deployment'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_deployment' },
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

                minReadySeconds: { type: 'number' },
                paused: { type: 'boolean' },
                progressDeadlineSeconds: { type: 'number' },
                replicas: { type: 'number' },
                revisionHistoryLimit: { type: 'number' },
                'strategy.type': { type: 'string' },
                'strategy.maxSurge': { type: 'string' },
                'strategy.maxUnavailable': { type: 'string' },
                'status.availableReplicas': { type: 'number' },
                'status.collisionCount': { type: 'number' },
                'status.observedGeneration': { type: 'number' },
                'status.readyReplicas': { type: 'number' },
                'status.replicas': { type: 'number' },
                'status.unavailableReplicas': { type: 'number' },
                'status.updatedReplicas': { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_DEPLOYMENT._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_deployment' },
              },
            },
          },
        },
      ],
    });
  });
});
