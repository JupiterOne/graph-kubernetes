import { createPodEntity } from './converters';
import { createMockPod } from '../../../test/mocks';

describe('#createPodEntity', () => {
  test('should convert data', () => {
    expect(createPodEntity(createMockPod())).toMatchSnapshot();
  });
});
