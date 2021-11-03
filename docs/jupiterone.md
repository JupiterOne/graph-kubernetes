# Integration with JupiterOne

## Kubernetes + JupiterOne Integration Benefits

- Visualize Kubernetes resources in the JupiterOne graph.
- Monitor changes using JupiterOne alerts.

## How it Works

- When the docker image runs it will fetches resources from Kubernetes to update
  the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when JupiterOne graph changes.

## Requirements

- A running Kubernetes cluster. This integration will be deployed as a pod and
  interact with Kubernetes API server.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Kubernetes** integration tile and click it.
3. Click the **Add Configuration** button.
4. Enter the **Account Name** by which you'd like to identify this Kubernetes
   account in JupiterOne. Ingested entities will have this value stored in
   `tag.AccountName` when **Tag with Account Name** is checked.
5. Enter a **Description** that will further assist your team when identifying
   the integration instance.
6. Click **Create Configuration** once all values are provided.
7. On the **Configuration Settings** page click **CREATE** next to **Integration
   API Keys**.
8. Follow the prompts to create the **Integration API Key**, click **REVEAL**,
   make note of the API Key.
9. Below you will need to decide how you install the Kubernetes integration in
   your cluster. As part of the installation you will need:
   - The **Integration API Key** you just created
   - The **Integration Instance Id** (which is listed as ID in the
     **Configuration Settings**)
   - Your **Account Id** (listed under **Account Management** after clicking the
     **Gear Icon**).

### In Kubernetes Via Helm

The easiest way to install and update the `graph-kubernetes` project is through
the published helm chart. You can find information on how to install our
repository [here](https://github.com/JupiterOne/helm-charts) with specific
information about maintain the graph-kubernetes chart
[here](https://github.com/JupiterOne/helm-charts/tree/main/charts/graph-kubernetes).

#### Quickstart

```console
helm repo add jupiterone https://jupiterone.github.io/helm-charts
helm repo update
helm install [RELEASE_NAME] jupiterone/graph-kubernetes --set secrets.jupiteroneAccountId="some-account-id" --set secrets.jupiteroneApiKey="some-api-key" --set secrets.jupiteroneIntegrationInstanceId="some-integration-instance-id"
```

### In Kubernetes Via Standard YAML

#### Authentication

##### RBAC

This integration expects a service account with either specific namespace
read-only access or cluster-wide read-only access.

#### Creating service account with namespace read-only access

1. Create a new service account

`kubectl create sa jupiterone-integration`

2. Assign namespace read-only access

`kubectl create rolebinding jupiterone-integration-view --clusterrole=view --serviceaccount=default:jupiterone-integration --namespace=default`

#### Creating service account with cluster-wide read-only access

1. Create a new service account

`kubectl create sa jupiterone-integration-cluster`

2. Assign cluster-wide read-only access

`kubectl apply -f clusterRole.yml`

`kubectl apply -f clusterRoleBinding.yml`

If using a different service account name or different namespace name, make sure
to use the correct name in both the commands/yaml listed above.

#### Secrets

The integration requires you to store `jupiterone account id`,
`jupiterone api key` and `integration id` as secrets that will be read by the
pod.

1. Update the `createSecret.yml` with base64 encoded values.
2. `kubectl apply -f createSecret.yml`

#### Deploying

To deploy the built image as a pod:

a) To create cronjob deployment for a service account with namespace read-only
access `kubectl apply -f cronjobNamespace.yml`

b) To create deployment for a service account with entire cluster read-only
access `kubectl apply -f cronjobCluster.yml`

#### Debugging

```console
# To check if the cronjob has been created
kubectl get cronjob

# To check if the cronjob has spawned any jobs
kubectl get job

# To see the logs
kubectl logs --selector job-name=job-name
```

#### Uninstall

```console
# Delete the deployment
kubectl delete cronjob <name>

# Delete the service account
kubectl delete serviceaccount <serviceaccount> -n <namespace>

# Delete the cluster role binding
kubectl delete clusterrolebinding <clusterrolebinding>

# Delete the cluster role binding
kubectl delete clusterole <clusterrole>
```

#### Upgrading

To upgrade a particular resource (cronjob, secrets, etc) all you need to do is
reapply the yaml:

```console
kubectl apply -f resourceFile.yaml
```

## Advanced Usage

### Telemetry and Diagnostics

The Helm charts and vanilla Kubernetes yaml are instrumented with the
[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/)
and [FluentBit](https://docs.fluentbit.io/manual/) with FluentBit forwarding
docker logs into the OpenTelemetry Collector. If you'd like to forward the same
telemetry to your own internal systems (CloudWatch, Prometheus, etc)
[configure](https://opentelemetry.io/docs/collector/configuration/) the
collector to point to them and update the manifests.

For detailed information on installing the Kubernetes install

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Kubernetes** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources                      | Entity `_type`             | Entity `_class` |
| ------------------------------ | -------------------------- | --------------- |
| Kubernetes Cluster             | `kube_cluster`             | `Cluster`       |
| Kubernetes ConfigMap           | `kube_config_map`          | `Configuration` |
| Kubernetes CronJob             | `kube_cron_job`            | `Task`          |
| Kubernetes DaemonSet           | `kube_daemon_set`          | `Deployment`    |
| Kubernetes Deployment          | `kube_deployment`          | `Deployment`    |
| Kubernetes Job                 | `kube_job`                 | `Task`          |
| Kubernetes Namespace           | `kube_namespace`           | `Group`         |
| Kubernetes Node                | `kube_node`                | `Host`          |
| Kubernetes Pod Security Policy | `kube_pod_security_policy` | `Configuration` |
| Kubernetes ReplicaSet          | `kube_replica_set`         | `Deployment`    |
| Kubernetes Secret              | `kube_secret`              | `Vault`         |
| Kubernetes Service             | `kube_service`             | `Service`       |
| Kubernetes StatefulSet         | `kube_stateful_set`        | `Deployment`    |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`      |
| --------------------- | --------------------- | -------------------------- |
| `kube_cluster`        | **CONTAINS**          | `kube_namespace`           |
| `kube_cluster`        | **CONTAINS**          | `kube_pod_security_policy` |
| `kube_cron_job`       | **MANAGES**           | `kube_job`                 |
| `kube_deployment`     | **MANAGES**           | `kube_replica_set`         |
| `kube_namespace`      | **CONTAINS**          | `kube_config_map`          |
| `kube_namespace`      | **CONTAINS**          | `kube_cron_job`            |
| `kube_namespace`      | **CONTAINS**          | `kube_daemon_set`          |
| `kube_namespace`      | **CONTAINS**          | `kube_deployment`          |
| `kube_namespace`      | **CONTAINS**          | `kube_job`                 |
| `kube_namespace`      | **CONTAINS**          | `kube_replica_set`         |
| `kube_namespace`      | **CONTAINS**          | `kube_secret`              |
| `kube_namespace`      | **CONTAINS**          | `kube_service`             |
| `kube_namespace`      | **CONTAINS**          | `kube_stateful_set`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
