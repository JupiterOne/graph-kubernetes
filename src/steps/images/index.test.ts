import { fetchImages } from '.';
import { integrationConfig } from '../../../test/config';
import { createDataCollectionTest } from '../../../test/recording';
import { fetchNodes } from '../nodes';

describe('#fetchContainerImages', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchContainerImages',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNodes, fetchImages],
    });
  });
});
