import * as k8s from '@kubernetes/client-node';
import { IntegrationConfig } from '../config';
import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';

export interface ClientOptions {
  config: IntegrationConfig;
}

export type ApiGroupType = 'core' | 'batch' | 'networking.k8s.io' | 'apps';

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
  | 'secrets';

export type VerbType = 'list' | 'create';

export class Client {
  public kubeConfig: k8s.KubeConfig;
  public config: IntegrationConfig;
  protected readonly maxPerPage = 250;

  private appsClient: k8s.AppsV1Api;
  private authorizationClient: k8s.AuthorizationV1Api;
  private batchClient: k8s.BatchV1Api;
  private coreClient: k8s.CoreV1Api;
  private netwokClient: k8s.NetworkingV1Api;
  private rbacClient: k8s.RbacAuthorizationV1Api;

  constructor(config: IntegrationConfig) {
    this.config = config;
    this.kubeConfig = new k8s.KubeConfig();

    this.authenticate();

    this.appsClient = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
    this.authorizationClient = this.kubeConfig.makeApiClient(
      k8s.AuthorizationV1Api,
    );
    this.batchClient = this.kubeConfig.makeApiClient(k8s.BatchV1Api);
    this.coreClient = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
    this.netwokClient = this.kubeConfig.makeApiClient(k8s.NetworkingV1Api);
    this.rbacClient = this.kubeConfig.makeApiClient(k8s.RbacAuthorizationV1Api);
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

  /**
   * Apps
   */
  async iterateNamespacedDeployments(
    namespace: string,
    callback: (data: k8s.V1Deployment) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.appsClient.listNamespacedDeployment(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1DeploymentList) => {
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
        return this.appsClient.listNamespacedReplicaSet(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1ReplicaSetList) => {
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
        return this.appsClient.listNamespacedStatefulSet(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1StatefulSetList) => {
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
        return this.appsClient.listNamespacedDaemonSet(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1DaemonSetList) => {
        for (const daemonSet of data.items || []) {
          await callback(daemonSet);
        }
      },
    );
  }

  /**
   * Authorization
   */
  async fetchSubjectServiceAccess(
    group: ApiGroupType,
    resource: ResourceType,
    verb: VerbType,
  ): Promise<k8s.V1SelfSubjectAccessReview> {
    const resp = await this.authorizationClient.createSelfSubjectAccessReview({
      kind: 'SelfSubjectAccessReview',
      apiVersion: 'authorization.k8s.io/v1',
      spec: {
        resourceAttributes: {
          namespace: 'default',
          verb: verb,
          group: group !== 'core' ? group : '',
          resource: resource,
        },
      },
    });

    return resp.body;
  }

  /**
   * Batch
   */
  async iterateNamespacedJobs(
    namespace: string,
    callback: (data: k8s.V1Job) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.batchClient.listNamespacedJob(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1JobList) => {
        for (const job of data.items || []) {
          await callback(job);
        }
      },
    );
  }

  /**
   * Batch1beta
   */
  async iterateNamespacedCronJobs(
    namespace: string,
    callback: (data: k8s.V1CronJob) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.batchClient.listNamespacedCronJob(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1CronJobList) => {
        for (const cronJob of data.items || []) {
          await callback(cronJob);
        }
      },
    );
  }

  /**
   * Core
   */
  async verifyAuthentication() {
    try {
      await this.coreClient.listNamespace();
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/apis/apps/v1/namespaces',
        status: 400,
        statusText: err.message,
      });
    }
  }

  async iterateNamespaces(
    callback: (data: k8s.V1Namespace) => Promise<void>,
  ): Promise<void> {
    const { accessType, namespace } = this.config;

    if (accessType?.toLowerCase() === 'namespace') {
      const resp = await this.coreClient.readNamespace(namespace as string);
      await callback(resp.body);
    } else {
      await this.iterateApi(
        async (nextPageToken) => {
          return this.coreClient.listNamespace(
            undefined,
            undefined,
            nextPageToken,
            undefined,
            undefined,
            this.maxPerPage,
          );
        },
        async (data: k8s.V1NamespaceList) => {
          for (const namespace of data.items || []) {
            await callback(namespace);
          }
        },
      );
    }
  }

  async iterateNodes(
    callback: (data: k8s.V1Node) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.coreClient.listNode(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1NodeList) => {
        for (const node of data.items) {
          await callback(node);
        }
      },
    );
  }

  async iterateNamespacedServices(
    namespace: string,
    callback: (data: k8s.V1Service) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.coreClient.listNamespacedService(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1ServiceList) => {
        for (const service of data.items) {
          await callback(service);
        }
      },
    );
  }

  async iterateNamespacedConfigMaps(
    namespace: string,
    callback: (data: k8s.V1ConfigMap) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.coreClient.listNamespacedConfigMap(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1ConfigMapList) => {
        for (const configMap of data.items || []) {
          await callback(configMap);
        }
      },
    );
  }

  async iterateNamespacedSecrets(
    namespace: string,
    callback: (data: k8s.V1Secret) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.coreClient.listNamespacedSecret(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1SecretList) => {
        for (const secret of data.items || []) {
          await callback(secret);
        }
      },
    );
  }

  async iterateNamespacedServiceAccounts(
    namespace: string,
    callback: (data: k8s.V1ServiceAccount) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.coreClient.listNamespacedServiceAccount(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1ServiceAccountList) => {
        for (const item of data.items) {
          await callback(item);
        }
      },
    );
  }

  async iterateUsers(
    callback: (data: k8s.User) => Promise<void>,
  ): Promise<void> {
    for (const user of this.kubeConfig.users || []) {
      await callback(user);
    }
  }

  /**
   * Network
   */
  async iterateNamespacedNetworkPolicies(
    namespace: string,
    callback: (data: k8s.V1NetworkPolicy) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.netwokClient.listNamespacedNetworkPolicy(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1NetworkPolicyList) => {
        for (const item of data.items) {
          await callback(item);
        }
      },
    );
  }

  /**
   * RBAC
   */
  async iterateNamespacedRoles(
    namespace: string,
    callback: (data: k8s.V1Role) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.rbacClient.listNamespacedRole(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1RoleList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateClusterRoles(
    callback: (data: k8s.V1ClusterRole) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.rbacClient.listClusterRole(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1ClusterRoleList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateNamespacedRoleBindings(
    namespace: string,
    callback: (data: k8s.V1RoleBinding) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.rbacClient.listNamespacedRoleBinding(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1RoleBindingList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateClusterRoleBindings(
    callback: (data: k8s.V1ClusterRoleBinding) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.rbacClient.listClusterRoleBinding(
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1ClusterRoleBindingList) => {
        for (const item of data.items || []) {
          await callback(item);
        }
      },
    );
  }

  async iterateNamespacedPods(
    namespace: string,
    callback: (data: k8s.V1Pod) => Promise<void>,
  ): Promise<void> {
    await this.iterateApi(
      async (nextPageToken) => {
        return this.coreClient.listNamespacedPod(
          namespace,
          undefined,
          undefined,
          nextPageToken,
          undefined,
          undefined,
          this.maxPerPage,
        );
      },
      async (data: k8s.V1PodList) => {
        for (const pod of data.items) {
          await callback(pod);
        }
      },
    );
  }
}
