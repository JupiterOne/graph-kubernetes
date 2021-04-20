import { fetchNamespaces } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities } from '../constants';

describe('#fetchNamespaces', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchNamespaces',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces],
      entitySchemaMatchers: [
        {
          _type: Entities.NAMESPACE._type,
          matcher: {
            _class: ['Group'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_namespace' },
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
                finalizers: {
                  type: 'array',
                  items: { type: 'string' },
                },
                'status.phase': { type: 'string' },
              },
            },
          },
        },
      ],
    });
  });
});
