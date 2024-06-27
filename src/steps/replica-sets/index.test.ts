import { buildContainerSpecReplicasetRelationship, fetchReplicaSets } from '.';
import { fetchNamespaces } from '../namespaces';
import { fetchDeployments } from '../deployments';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchReplicaSets', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchReplicaSets',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [
        fetchNamespaces,
        fetchDeployments,
        fetchReplicaSets,
        buildContainerSpecReplicasetRelationship,
      ],
      entitySchemaMatchers: [
        {
          _type: Entities.REPLICASET._type,
          matcher: {
            _class: ['Deployment'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_replica_set' },
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
                replicas: { type: 'number' },
                'status.availableReplicas': { type: 'number' },
                'status.fullyLabeledReplicas': { type: 'number' },
                'status.observedGeneration': { type: 'number' },
                'status.readyReplicas': { type: 'number' },
                'status.replicas': { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.DEPLOYMENT_MANAGES_REPLICASET._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.MANAGES },
                _type: { const: 'kube_deployment_manages_replica_set' },
              },
            },
          },
        },
        {
          _type: Relationships.CONTAINER_SPEC_HAS_REPLICASET._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'kube_container_spec_has_replica_set' },
              },
            },
          },
        },
      ],
    });
  });
});
