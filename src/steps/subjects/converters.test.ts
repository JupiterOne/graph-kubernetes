import { createServiceAccountEntity } from './converters';
import { createMockServiceAccount } from '../../../test/mocks';

describe('#createServiceAccountEntity', () => {
  test('should convert data', () => {
    expect(
      createServiceAccountEntity(createMockServiceAccount()),
    ).toMatchSnapshot();
  });
});
