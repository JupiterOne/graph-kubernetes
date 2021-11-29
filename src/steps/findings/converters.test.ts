import { createFindingEntity } from './converters';

describe('#createFindingEntity', () => {
  test('should convert data', () => {
    const mockFinding = {
      version: 'cis-1.20',
      testNumber: '1.1.1',
      status: 'PASS',
    };
    expect(createFindingEntity(mockFinding)).toMatchSnapshot();
  });
});
