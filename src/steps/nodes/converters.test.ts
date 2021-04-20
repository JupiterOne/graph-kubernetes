import { createNodeEntity } from './converters';
import { createMockNode } from '../../../test/mocks';

describe('#createNodeEntity', () => {
  test('should convert data', () => {
    expect(createNodeEntity(createMockNode())).toMatchSnapshot();
  });
});
