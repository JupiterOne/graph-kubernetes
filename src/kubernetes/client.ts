import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig } from '../config';

export interface ClientOptions {
  config: IntegrationConfig;
}

export class Client {
  public kubeConfig: k8s.KubeConfig;
  public config: IntegrationConfig;
  protected readonly maxPerPage = 50;

  constructor(config: IntegrationConfig) {
    this.config = config;
    this.kubeConfig = new k8s.KubeConfig();
  }

  async iterateApi(
    fn: (nextPageToken?: string) => Promise<any>,
    callback: (data: any) => Promise<void>,
  ) {
    let nextPageToken: string | undefined;

    do {
      const result = await fn(nextPageToken);
      nextPageToken = result.body.metadata._continue;
      await callback(result.body);
    } while (nextPageToken);
  }

  authenticate() {
    if (this.config.loadKubernetesConfigFromDefault) {
      this.kubeConfig.loadFromDefault();
    } else {
      this.kubeConfig.loadFromCluster();
    }
  }
}
