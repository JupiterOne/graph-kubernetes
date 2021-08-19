# Development

Add details here to give a brief overview of how to work with the provider APIs.
Please reference any SDKs or API docs used to help build the integration here.

## Prerequisites

Supply details about software or tooling (like maybe Docker or Terraform) that
is needed for development here.

Please supply references to documentation that details how to install those
dependencies here.

Tools like Node.js and NPM are already covered in the [README](../README.md) so
don't bother documenting that here.

## Provider account setup

### Helm

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

### K8S Standard

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
to use the correct name in both the commands/yml listed above.

### Secrets

The integration requires you to store `jupiterone account id`,
`jupiterone api key` and `integration id` as secrets that will be read by the
pod.

1. Update the `createSecret.yml` with base64 encoded values.
2. `kubectl apply -f createSecret.yml`

### Deploying

To deploy the built image as a pod:

a) To create cronjob deployment for a service account with namespace read-only
access `kubectl apply -f cronjobNamespace.yml`

b) To create deployment for a service account with entire cluster read-only
access `kubectl apply -f cronjobCluster.yml`

### Debugging

```console
# To check if the cronjob has been created
kubectl get cronjob

# To check if the cronjob has spawned any jobs
kubectl get job

# To see the logs
kubectl logs --selector job-name=job-name
```

### Uninstall

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

### Upgrading

To upgrade a particular resource (cronjob, secrets, etc) all you need to do is
reapply the yaml:

```console
kubectl apply -f resourceFile.yaml
```
