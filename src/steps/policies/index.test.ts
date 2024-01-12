import { fetchNetworkPolicies } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';
import { fetchNamespaces } from '../namespaces';

describe('#fetchNetworkPolicies', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchNetworkPolicies',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchNetworkPolicies],
      entitySchemaMatchers: [
        {
          _type: Entities.NETWORK_POLICY._type,
          matcher: {
            _class: ['Configuration'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_network_policy' },
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
                policyTypes: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_NETWORK_POLICY._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_network_policy' },
              },
            },
          },
        },
      ],
    });
  });
});
