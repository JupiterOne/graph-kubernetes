import { createDataCollectionTest } from '../../../test/recording';
import { buildClusterResourcesRelationships, fetchClusterDetails } from '.';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { fetchNamespaces } from '../namespaces';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchClusterDetails', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchClusterDetails',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchClusterDetails],
      entitySchemaMatchers: [
        {
          _type: Entities.CLUSTER._type,
          matcher: {
            _class: ['Cluster'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_cluster' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#buildClusterResourcesRelationships', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'buildClusterResourcesRelationships',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [
        fetchClusterDetails,
        fetchNamespaces,
        buildClusterResourcesRelationships,
      ],
      entitySchemaMatchers: [],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.CLUSTER_CONTAINS_NAMESPACE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_cluster_contains_namespace' },
              },
            },
          },
        },
      ],
    });
  });
});
