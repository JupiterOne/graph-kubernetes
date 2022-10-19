import { Cluster } from '@kubernetes/client-node';
import { createClusterEntity } from './converters';

describe('#createClusterEntity', () => {
  test('should convert data', () => {
    const cluster: Cluster = {
      name: 'dummy-data',
      server: 'dummy-data',
      skipTLSVerify: false,
    };
    expect(createClusterEntity(cluster)).toMatchSnapshot();
  });
});
