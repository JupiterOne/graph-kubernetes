import * as k8s from '@kubernetes/client-node';
import {
  V1DaemonSetList,
  V1DeploymentList,
  V1ReplicaSetList,
  V1StatefulSetList,
} from '@kubernetes/client-node';
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
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedDeployment(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1DeploymentList) => {
        for (const deployment of data.items || []) {
          await callback(deployment);
        }
      },
    );
  }

  async iterateReplicaSets(
    namespace: string,
    callback: (data: k8s.V1ReplicaSet) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedReplicaSet(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1ReplicaSetList) => {
        for (const replicaSet of data.items || []) {
          await callback(replicaSet);
        }
      },
    );
  }

  async iterateStatefulSets(
    namespace: string,
    callback: (data: k8s.V1StatefulSet) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedStatefulSet(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1StatefulSetList) => {
        for (const statefulSet of data.items || []) {
          await callback(statefulSet);
        }
      },
    );
  }

  async iterateDaemonSets(
    namespace: string,
    callback: (data: k8s.V1DaemonSet) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedDaemonSet(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1DaemonSetList) => {
        for (const daemonSet of data.items || []) {
          await callback(daemonSet);
        }
      },
    );
  }
}
