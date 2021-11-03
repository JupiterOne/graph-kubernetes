import * as k8s from '@kubernetes/client-node';
import { V1NetworkPolicyList } from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class NetworkClient extends Client {
  private readonly client: k8s.NetworkingV1Api;

  constructor(config: IntegrationConfig) {
    super(config);

    this.authenticate();
    this.client = this.kubeConfig.makeApiClient(k8s.NetworkingV1Api);
  }

  async iterateNamespacedNetworkPolicies(
    namespace: string,
    callback: (data: k8s.V1NetworkPolicy) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedNetworkPolicy(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1NetworkPolicyList) => {
        for (const item of data.items) {
          await callback(item);
        }
      },
    );
  }
}
