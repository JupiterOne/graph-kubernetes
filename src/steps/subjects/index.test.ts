import { fetchServiceAccounts, fetchUsers } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';
import { fetchNamespaces } from '../namespaces';

describe('#fetchServiceAccounts', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchServiceAccounts',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchServiceAccounts],
      entitySchemaMatchers: [],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_SERVICE_ACCOUNT._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_service_account' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#fetchUsers', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchUsers',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchUsers],
      entitySchemaMatchers: [
        {
          _type: Entities.USER._type,
          matcher: {
            _class: ['User'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_user' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                username: { type: 'string' },
                displayName: { type: 'string' },
                certFile: { type: 'string' },
                keyFile: { type: 'string' },
                active: { type: 'boolean' },
              },
            },
          },
        },
      ],
    });
  });
});
