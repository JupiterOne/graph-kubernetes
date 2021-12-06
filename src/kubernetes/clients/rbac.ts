import * as k8s from '@kubernetes/client-node';
import {
  V1ClusterRoleBindingList,
  V1ClusterRoleList,
  V1RoleBindingList,
  V1RoleList,
} from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class RbacAuthorizationClient extends Client {
  private client: k8s.RbacAuthorizationV1Api;

  constructor(config: IntegrationConfig) {
    super(config);

    this.authenticate();
    this.client = this.kubeConfig.makeApiClient(k8s.RbacAuthorizationV1Api);
  }

  async iterateNamespacedRoles(
    namespace: string,
    callback: (data: k8s.V1Role) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedRole(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1RoleList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateClusterRoles(
    callback: (data: k8s.V1ClusterRole) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listClusterRole(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1ClusterRoleList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateNamespacedRoleBindings(
    namespace: string,
    callback: (data: k8s.V1RoleBinding) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedRoleBinding(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1RoleBindingList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateClusterRoleBindings(
    callback: (data: k8s.V1ClusterRoleBinding) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listClusterRoleBinding(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1ClusterRoleBindingList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }
}
