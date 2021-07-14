import { createJobEntity } from './converters';
import { createMockJob } from '../../../test/mocks';

describe('#createJobEntity', () => {
  test('should convert data', () => {
    expect(createJobEntity(createMockJob())).toMatchSnapshot();
  });
});
