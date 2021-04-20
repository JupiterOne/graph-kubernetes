import { createServiceEntity } from './converters';
import { createMockService } from '../../../test/mocks';

describe('#createServiceEntity', () => {
  test('should convert data', () => {
    expect(createServiceEntity(createMockService())).toMatchSnapshot();
  });
});
