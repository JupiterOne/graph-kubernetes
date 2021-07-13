import { fetchSecrets } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchSecrets', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchSecrets',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchSecrets],
      entitySchemaMatchers: [
        {
          _type: Entities.SECRET._type,
          matcher: {
            _class: ['Vault'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_secret' },
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
                type: { type: 'string' },
                classification: { const: null },
                encrypted: { type: 'boolean' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_SECRET._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_secret' },
              },
            },
          },
        },
      ],
    });
  });
});
