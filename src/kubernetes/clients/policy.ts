import * as k8s from '@kubernetes/client-node';
import { V1beta1PodSecurityPolicyList } from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export class PolicyClient extends Client {
  private client: k8s.PolicyV1beta1Api;

  constructor(config: IntegrationConfig) {
    super(config);

    this.authenticate();
    this.client = this.kubeConfig.makeApiClient(k8s.PolicyV1beta1Api);
  }

  async iteratePodSecurityPolicies(
    callback: (data: k8s.V1beta1PodSecurityPolicy) => Promise<void>,
  ) {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.client.listPodSecurityPolicy(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: V1beta1PodSecurityPolicyList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }
}
