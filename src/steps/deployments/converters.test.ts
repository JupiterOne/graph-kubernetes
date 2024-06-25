import {
  createContainerSpecEntity,
  createContainerSpecToVolumeRelationship,
  createDeploymentEntity,
  createVolumeEntity,
} from './converters';
import {
  createMockContainer,
  createMockDeployment,
  createMockVolume,
  createMockVolumeMount,
} from '../../../test/mocks';

describe('#createDeploymentEntity', () => {
  test('should convert data', () => {
    expect(createDeploymentEntity(createMockDeployment())).toMatchSnapshot();
  });
});

describe('#createContainerSpecToVolumeRelationship', () => {
  test('should generate relationship with mountPath', () => {
    const deploymentId = '12345';
    const namespaceName = 'default';


    expect(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity: createContainerSpecEntity(
          deploymentId,
          createMockContainer(),
        ),
        volumeEntity: createVolumeEntity(namespaceName, deploymentId, createMockVolume()),
        volumeMount: createMockVolumeMount(),
      }),
    ).toMatchSnapshot();
  });

  test('should generate relationship without mountPath', () => {
    const deploymentId = '12345';
    const namespaceName = 'default';

    expect(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity: createContainerSpecEntity(
          deploymentId,
          createMockContainer(),
        ),
        volumeEntity: createVolumeEntity(namespaceName, deploymentId, createMockVolume()),
        volumeMount: createMockVolumeMount({
          mountPath: undefined,
        }),
      }),
    ).toMatchSnapshot();
  });

  test('should generate relationship with mountPath and subPath', () => {
    const deploymentId = '12345';
    const namespaceName = 'default';

    expect(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity: createContainerSpecEntity(
          deploymentId,
          createMockContainer(),
        ),
        volumeEntity: createVolumeEntity(namespaceName, deploymentId, createMockVolume()),
        volumeMount: createMockVolumeMount({
          subPath: 'abc',
        }),
      }),
    ).toMatchSnapshot();
  });
});
