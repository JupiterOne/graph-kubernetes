import { fetchDaemonSets } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchDaemonSets', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchDaemonSets',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchDaemonSets],
      entitySchemaMatchers: [
        {
          _type: Entities.CRONJOB._type,
          matcher: {
            _class: ['Deployment'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_daemon_set' },
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
                minReadySeconds: { type: 'number' },
                revisionHistoryLimit: { type: 'number' },
                'strategy.type': { type: 'string' },
                'strategy.maxUnavailable': { type: 'string' },
                'status.collisionCount': { type: 'number' },
                'status.currentNumberScheduled': { type: 'number' },
                'status.desiredNumberScheduled': { type: 'number' },
                'status.numberAvailable': { type: 'number' },
                'status.numberMisscheduled': { type: 'number' },
                'status.numberReady': { type: 'number' },
                'status.numberUnavailable': { type: 'number' },
                'status.observedGeneration': { type: 'number' },
                'status.updatedNumberScheduled': { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_DAEMONSET._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_daemon_set' },
              },
            },
          },
        },
      ],
    });
  });
});
