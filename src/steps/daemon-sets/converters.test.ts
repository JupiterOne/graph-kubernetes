import { createDaemonSetEntity } from './converters';
import { createMockDaemonSet } from '../../../test/mocks';

describe('#createDaemonSetEntity', () => {
  test('should convert data', () => {
    expect(createDaemonSetEntity(createMockDaemonSet())).toMatchSnapshot();
  });
});
