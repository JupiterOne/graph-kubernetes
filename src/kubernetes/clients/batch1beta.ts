import * as k8s from '@kubernetes/client-node';
import { V1beta1CronJobList } from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class Batch1BetaClient extends Client {
  // Batch V1 beta1 is required for cronjobs
  private client: k8s.BatchV1beta1Api;

  constructor(config: IntegrationConfig) {
    super(config);
    this.authenticate();

    this.client = this.kubeConfig.makeApiClient(k8s.BatchV1beta1Api);
  }

  async iterateNamespacedCronJobs(
    namespace: string,
    callback: (data: k8s.V1beta1CronJob) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listNamespacedCronJob(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1beta1CronJobList) => {
        for (const cronJob of data.items || []) {
          await callback(cronJob);
        }
      },
    );
  }
}
