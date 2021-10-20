import { createClusterEntity } from './converters';

describe('#createClusterEntity', () => {
  test('should convert data', () => {
    const mockInstanceName = 'example integration';
    const mockInstanceId = 'example-integration';
    expect(
      createClusterEntity(mockInstanceName, mockInstanceId),
    ).toMatchSnapshot();
  });
});
