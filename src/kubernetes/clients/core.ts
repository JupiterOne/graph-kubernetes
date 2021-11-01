import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
import {
  V1ConfigMapList,
  V1NamespaceList,
  V1NodeList,
  V1PodList,
  V1SecretList,
  V1ServiceAccountList,
  V1ServiceList,
} from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class CoreClient extends Client {
  private client: k8s.CoreV1Api;

  constructor(config: IntegrationConfig) {
    super(config);

    this.authenticate();
    this.client = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
  }

  // TODO: to be replaced with most lightweight API call
  async verifyAuthentication() {
    try {
      await this.client.listNamespace();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/apis/apps/v1/namespaces',
        status: 400,
        statusText: err.message,
      });
    }
  }

  async iterateNamespaces(
    callback: (data: k8s.V1Namespace) => Promise<void>,
  ): Promise<void> {
    const { accessType, namespace } = this.config;

    if (accessType?.toLowerCase() === 'namespace') {
      const resp = await this.client.readNamespace(namespace as string);
      await callback(resp.body);
    } else {
      await this.iterateApi(
        async (nextPageToken) => {
          return this.client.listNamespace(
            undefined,
            undefined,
            nextPageToken,
            undefined,
            undefined,
            this.maxPerPage,
          );
        },
        async (data: V1NamespaceList) => {
          for (const namespace of data.items || []) {
            await callback(namespace);
          }
        },
      );
    }
  }

  async iterateNamespacedPods(
    namespace: string,
    callback: (data: k8s.V1Pod) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedPod(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1PodList) => {
        for (const pod of data.items) {
          await callback(pod);
        }
      },
    );
  }

  async iterateNodes(
    callback: (data: k8s.V1Node) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNode(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1NodeList) => {
        for (const node of data.items) {
          await callback(node);
        }
      },
    );
  }

  async iterateNamespacedServices(
    namespace: string,
    callback: (data: k8s.V1Service) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedService(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1ServiceList) => {
        for (const service of data.items) {
          await callback(service);
        }
      },
    );
  }

  async iterateNamespacedConfigMaps(
    namespace: string,
    callback: (data: k8s.V1ConfigMap) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedConfigMap(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1ConfigMapList) => {
        for (const configMap of data.items || []) {
          await callback(configMap);
        }
      },
    );
  }

  async iterateNamespacedSecrets(
    namespace: string,
    callback: (data: k8s.V1Secret) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedSecret(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1SecretList) => {
        for (const secret of data.items || []) {
          await callback(secret);
        }
      },
    );
  }

  async iterateNamespacedServiceAccounts(
    namespace: string,
    callback: (data: k8s.V1ServiceAccount) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedServiceAccount(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1ServiceAccountList) => {
        for (const item of data.items) {
          await callback(item);
        }
      },
    );
  }
}
