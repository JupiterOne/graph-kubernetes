import { fetchConfigMaps } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchConfigMaps', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchConfigMaps',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchConfigMaps],
      entitySchemaMatchers: [
        {
          _type: Entities.CONFIGMAP._type,
          matcher: {
            _class: ['Configuration'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_config_map' },
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
                immutable: { type: 'boolean' },
                classification: { const: null },
                encrypted: { type: 'boolean' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_CONFIGMAP._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_config_map' },
              },
            },
          },
        },
      ],
    });
  });
});
