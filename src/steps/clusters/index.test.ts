import { fetchClusterDetails } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities } from '../constants';

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
