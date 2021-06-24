import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';
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
      throw new IntegrationProviderAuthenticationError(err.message);
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
      const resp = await this.client.listNamespace();

      for (const namespace of resp.body.items || []) {
        await callback(namespace);
      }
    }
  }

  async iterateNamespacedPods(
    namespace: string,
    callback: (data: k8s.V1Pod) => Promise<void>,
  ): Promise<void> {
    const resp = await this.client.listNamespacedPod(namespace);

    for (const pod of resp.body.items || []) {
      await callback(pod);
    }
  }

  async iterateNodes(
    callback: (data: k8s.V1Node) => Promise<void>,
  ): Promise<void> {
    const resp = await this.client.listNode();
    for (const node of resp.body.items || []) {
      await callback(node);
    }
  }

  async iterateServices(
    callback: (data: k8s.V1Service) => Promise<void>,
  ): Promise<void> {
    const resp = await this.client.listServiceForAllNamespaces();
    for (const service of resp.body.items || []) {
      await callback(service);
    }
  }

  async iterateNamespacedServices(
    namespace: string,
    callback: (data: k8s.V1Service) => Promise<void>,
  ): Promise<void> {
    const resp = await this.client.listNamespacedService(namespace);
    for (const service of resp.body.items || []) {
      await callback(service);
    }
  }
}
