import { createStatefulSetEntity } from './converters';
import { createMockStatefulSet } from '../../../test/mocks';

describe('#createStatefulSetEntity', () => {
  test('should convert data', () => {
    expect(createStatefulSetEntity(createMockStatefulSet())).toMatchSnapshot();
  });
});
