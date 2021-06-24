import * as k8s from '@kubernetes/client-node';
import { V1JobList } from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class BatchClient extends Client {
  private client: k8s.BatchV1Api;

  constructor(config: IntegrationConfig) {
    super(config);
    this.authenticate();

    this.client = this.kubeConfig.makeApiClient(k8s.BatchV1Api);
  }

  async iterateNamespacedJobs(
    namespace: string,
    callback: (data: k8s.V1Job) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedJob(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1JobList) => {
        for (const job of data.items || []) {
          await callback(job);
        }
      },
    );
  }
}
