import { createDeploymentEntity } from './converters';
import { createMockDeployment } from '../../../test/mocks';

describe('#createDeploymentEntity', () => {
  test('should convert data', () => {
    expect(createDeploymentEntity(createMockDeployment())).toMatchSnapshot();
  });
});
