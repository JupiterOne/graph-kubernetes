import {
  buildClusterAksRelationships,
  buildClusterGkeRelationships,
  buildClusterResourcesRelationships,
  fetchClusterDetails,
} from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, MappedRelationships, Relationships } from '../constants';
import { fetchNamespaces } from '../namespaces';
import { fetchConfigMaps } from '../config-maps';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

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
                server: { type: 'string' },
                skipTlsVerify: { type: 'boolean' },
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

describe('#buildClusterAksRelationships', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'buildClusterAksRelationships',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [
        fetchClusterDetails,
        fetchConfigMaps,
        buildClusterAksRelationships,
      ],
      entitySchemaMatchers: [],
      relationshipSchemaMatchers: [
        {
          _type: MappedRelationships.CLUSTER_IS_AKS_CLUSTER._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.IS },
                _type: { const: 'kube_cluster_is_azure_kubernetes_cluster' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#buildClusterGkeRelationships', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'buildClusterGkeRelationships',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchConfigMaps, buildClusterGkeRelationships],
      entitySchemaMatchers: [],
      relationshipSchemaMatchers: [
        {
          _type: MappedRelationships.CLUSTER_IS_GKE_CLUSTER._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.IS },
                _type: { const: 'kube_cluster_is_google_container_cluster' },
              },
            },
          },
        },
      ],
      options: {
        recordFailedRequests: true,
      },
    });
  });
});
