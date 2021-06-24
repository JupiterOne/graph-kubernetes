import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig } from '../config';

export interface ClientOptions {
  config: IntegrationConfig;
}

export abstract class Client {
  public kubeConfig: k8s.KubeConfig;
  public config: IntegrationConfig;

  constructor(config: IntegrationConfig) {
    this.config = config;
    this.kubeConfig = new k8s.KubeConfig();
  }

  authenticate() {
    if (this.config.isRunningTest) {
      this.kubeConfig.loadFromDefault();
    } else {
      this.kubeConfig.loadFromCluster();
    }
  }
}
