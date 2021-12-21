import { fetchServiceAccounts } from '.';
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
      entitySchemaMatchers: [
        {
          _type: Entities.POD_SECURITY_POLICY._type,
          matcher: {
            _class: ['User'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_service_account' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                username: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
              },
            },
          },
        },
      ],
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
