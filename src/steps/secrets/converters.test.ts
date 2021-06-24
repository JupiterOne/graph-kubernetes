import { createSecretEntity } from './converters';
import { createMockSecret } from '../../../test/mocks';

describe('#createSecretEntity', () => {
  test('should convert data', () => {
    expect(createSecretEntity(createMockSecret())).toMatchSnapshot();
  });
});
