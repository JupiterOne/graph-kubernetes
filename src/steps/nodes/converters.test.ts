import { createNodeEntity } from './converters';
import { createMockNode } from '../../../test/mocks';

describe('#createNodeEntity', () => {
  test('should convert data', () => {
    expect(createNodeEntity(createMockNode())).toMatchSnapshot();
  });

  test('should parse status.addresses correctly', () => {
    expect(
      createNodeEntity({
        ...createMockNode(),
        status: {
          addresses: [
            {
              address: '1.1.1.1',
              type: 'InternalIP',
            },
            {
              address: '2.2.2.2',
              type: 'InternalIP',
            },
            {
              address: '5.5.5.5',
              type: 'ExternalIP',
            },
            {
              address: '6.6.6.6',
              type: 'ExternalIP',
            },
            {
              address: 'minikube',
              type: 'Hostname',
            },
            {
              address: 'internalDns',
              type: 'InternalDns',
            },
            {
              address: 'externalDns',
              type: 'ExternalDns',
            },
          ],
        },
      }),
    ).toMatchSnapshot();
  });
});
