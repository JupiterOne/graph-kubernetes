import * as k8s from '@kubernetes/client-node';
import { V1ClusterRoleBindingList } from '@kubernetes/client-node';
import { IntegrationConfig } from '../../config';
import { Client } from '../client';

export type ResourceType =
  | 'nodes'
  | 'services'
  | 'deployments'
  | 'replicasets'
  | 'statefulsets'
  | 'daemonsets'
  | 'jobs'
  | 'cronjobs'
  | 'configmaps'
  | 'secrets'
  | 'pods';
export type VerbType = 'list' | 'create';

export class AuthorizationClient extends Client {
  private client: k8s.AuthorizationV1Api;

  constructor(config: IntegrationConfig) {
    super(config);

    this.authenticate();
    this.client = this.kubeConfig.makeApiClient(k8s.AuthorizationV1Api);
  }

  async fetchSubjectServiceAccess(
    resource: ResourceType,
    verb: VerbType,
  ): Promise<k8s.V1SelfSubjectAccessReview> {
    const groupAppsServices = ['deployments', 'replicasets'];
    const resp = await this.client.createSelfSubjectAccessReview({
      kind: 'SelfSubjectAccessReview',
      apiVersion: 'authorization.k8s.io/v1',
      spec: {
        resourceAttributes: {
          namespace: 'default',
          verb: verb,
          group: groupAppsServices.includes(resource) ? 'apps' : undefined,
          resource: resource,
        },
      },
    });

    return resp.body;
  }
}
