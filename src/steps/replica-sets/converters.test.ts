import { createReplicaSetEntity } from './converters';
import { createMockReplicaSet } from '../../../test/mocks';

describe('#createReplicaSetEntity', () => {
  test('should convert data', () => {
    expect(createReplicaSetEntity(createMockReplicaSet())).toMatchSnapshot();
  });
});
