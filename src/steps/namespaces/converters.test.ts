import { createNamespaceEntity } from './converters';
import { createMockNamespace } from '../../../test/mocks';

describe('#createNamespaceEntity', () => {
  test('should convert data', () => {
    expect(createNamespaceEntity(createMockNamespace())).toMatchSnapshot();
  });
});
