import { createServiceAccountEntity, createUserEntity } from './converters';
import { createMockServiceAccount, createMockUser } from '../../../test/mocks';

describe('#createServiceAccountEntity', () => {
  test('should convert data', () => {
    expect(
      createServiceAccountEntity(createMockServiceAccount()),
    ).toMatchSnapshot();
  });
});

describe('#createUserEntity', () => {
  test('should convert data', () => {
    expect(createUserEntity(createMockUser())).toMatchSnapshot();
  });
});
