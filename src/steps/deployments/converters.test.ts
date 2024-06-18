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
    const namespaceName = 'default';
    const deploymentId = '12345';

    expect(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity: createContainerSpecEntity(
          namespaceName,
          deploymentId,
          createMockContainer(),
        ),
        volumeEntity: createVolumeEntity(
          namespaceName,
          deploymentId,
          createMockVolume(),
        ),
        volumeMount: createMockVolumeMount(),
      }),
    ).toMatchSnapshot();
  });

  test('should generate relationship without mountPath', () => {
    const namespaceName = 'default';
    const deploymentId = '12345';

    expect(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity: createContainerSpecEntity(
          namespaceName,
          deploymentId,
          createMockContainer(),
        ),
        volumeEntity: createVolumeEntity(
          namespaceName,
          deploymentId,
          createMockVolume(),
        ),
        volumeMount: createMockVolumeMount({
          mountPath: undefined,
        }),
      }),
    ).toMatchSnapshot();
  });

  test('should generate relationship with mountPath and subPath', () => {
    const namespaceName = 'default';
    const deploymentId = '12345';

    expect(
      createContainerSpecToVolumeRelationship({
        containerSpecEntity: createContainerSpecEntity(
          namespaceName,
          deploymentId,
          createMockContainer(),
        ),
        volumeEntity: createVolumeEntity(
          namespaceName,
          deploymentId,
          createMockVolume(),
        ),
        volumeMount: createMockVolumeMount({
          subPath: 'abc',
        }),
      }),
    ).toMatchSnapshot();
  });
});
