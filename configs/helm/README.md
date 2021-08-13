# JupiterOne Graph Kubernetes

This chart bootstraps a
[graph-kubernetes](https://github.com/JupiterOne/graph-kubernetes) deployment on
a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh)
package manager.

## Prerequisites

- Kubernetes 1.16+
- Helm 3+

## Quickstart

If you're ok with the defaults and just want to set your account specific
information run the following commands with your account information:

```console
helm repo add jupiterone https://graph-kubernetes.github.io/helm-charts
helm repo update
helm install [RELEASE_NAME] jupiterone/graph-kubernetes --set secrets.jupiteroneAccountId="some-account-id" --set secrets.jupiteroneApiKey="some-api-key" --set secrets.jupiteroneIntegrationInstanceId="some-integration-instance-id"
```

## Get Repo Info

```console
helm repo add jupiterone https://graph-kubernetes.github.io/helm-charts
helm repo update
```

_See [helm repo](https://helm.sh/docs/helm/helm_repo/) for command
documentation._

## Install Chart

```console
$ helm install [RELEASE_NAME] jupiterone/graph-kubernetes
```

_See [configuration](#configuration) below._

_See [helm install](https://helm.sh/docs/helm/helm_install/) for command
documentation._

## Uninstall Chart

```console
$ helm uninstall [RELEASE_NAME]
```

This removes all the Kubernetes components associated with the chart and deletes
the release.

_See [helm uninstall](https://helm.sh/docs/helm/helm_uninstall/) for command
documentation._

## Upgrading Chart

```console
$ helm upgrade [RELEASE_NAME] jupiterone/graph-kubernetes --install
```

## Configuration

See
[Customizing the Chart Before Installing](https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing).
To see all configurable options with detailed comments, visit the chart's
[values.yaml](./values.yaml), or run these configuration commands:

```console
$ helm show values jupiterone/graph-kubernetes
```

### RBAC Configuration

To manually setup RBAC you need to set the parameter `rbac.create=false` and
specify the service account to be used by setting the parameters:
`serviceAccount.create` to `false` and `serviceAccount.name` to the name of a
pre-existing service account.

Roles and RoleBindings resources will be created automatically.
