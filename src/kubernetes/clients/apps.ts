import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class AppsClient extends Client {
  private client: k8s.AppsV1Api;

  constructor(config: IntegrationConfig) {
    super(config);
    this.authenticate();

    this.client = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
  }

  async iterateNamespacedDeployments(
    namespace: string,
    callback: (data: k8s.V1Deployment) => Promise<void>,
  ): Promise<void> {
    const resp = await this.client.listNamespacedDeployment(namespace);

    for (const deployment of resp.body.items || []) {
      await callback(deployment);
    }
  }

  async iterateReplicaSets(
    namespace: string,
    callback: (data: k8s.V1ReplicaSet) => Promise<void>,
  ): Promise<void> {
    const resp = await this.client.listNamespacedReplicaSet(namespace);

    for (const replicaset of resp.body.items || []) {
      await callback(replicaset);
    }
  }
}
