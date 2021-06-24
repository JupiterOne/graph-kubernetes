import { createCronJobEntity } from './converters';
import { createMockCronJob } from '../../../test/mocks';

describe('#createConfigMapEntity', () => {
  test('should convert data', () => {
    expect(createCronJobEntity(createMockCronJob())).toMatchSnapshot();
  });
});
