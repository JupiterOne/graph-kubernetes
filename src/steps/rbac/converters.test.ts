import { V1ClusterRoleBinding, V1RoleBinding } from '@kubernetes/client-node';
import {
  createClusterRoleBinding,
  createMockClusterRole,
  createMockRole,
  createMockRoleBinding,
} from '../../../test/mocks';
import {
  createClusterRoleBindingEntity,
  createClusterRoleEntity,
  createRoleBindingEntity,
  createRoleEntity,
} from './converters';

describe('#createRoleEntity', () => {
  test('should convert data', () => {
    expect(createRoleEntity(createMockRole())).toMatchSnapshot();
  });
});

describe('#createClusterRoleEntity', () => {
  test('should convert data', () => {
    expect(createClusterRoleEntity(createMockClusterRole())).toMatchSnapshot();
  });
});

describe('#createRoleBindingEntity', () => {
  test('should convert data', () => {
    expect(
      createRoleBindingEntity(createMockRoleBinding() as V1RoleBinding),
    ).toMatchSnapshot();
  });
});

describe('#createClusterRoleBindingEntity', () => {
  test('should convert data', () => {
    expect(
      createClusterRoleBindingEntity(
        createClusterRoleBinding() as V1ClusterRoleBinding,
      ),
    ).toMatchSnapshot();
  });
});
