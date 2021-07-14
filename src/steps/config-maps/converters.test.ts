import { createConfigMapEntity } from './converters';
import { createMockConfigMap } from '../../../test/mocks';

describe('#createConfigMapEntity', () => {
  test('should convert data', () => {
    expect(createConfigMapEntity(createMockConfigMap())).toMatchSnapshot();
  });
});
