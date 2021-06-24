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

Please provide information about the steps needed to create an account with a
provider. Images and references to a provider's documentation is very helpful
for new developers picking up your work.

## Authentication

### RBAC

This integration expects a service account with either specific namespace
read-only access or cluster-wide read-only access.

### Creating service account with namespace read-only access

1. Create a new service account

`kubectl create sa namespace-sa`

2. Assign namespace read-only access

`kubectl create rolebinding namespace-sa-view --clusterrole=view --serviceaccount=default:namespace-sa --namespace=default`

### Creating service account with cluster-wide read-only access

1. Create a new service account

`kubectl create sa cluster-sa`

2. Assign cluster-wide read-only access

`kubectl apply -f ./configs/clusterRole.yml`

`kubectl apply -f ./configs/clusterRoleBinding.yml`

If using a different service account name or different namespace name, make sure
to use the correct name in both the commands/yml listed above.

### Secrets

The integration requires you to store `jupiterone account id`,
`jupiterone api key` and `integration id` as secrets that will be read by the
pod.

Update the `./configs/createSecret.yml` with base64 encoded values.

### Building the image and running the integration

1. Make sure the kubernetes is set-up/running.

If you want to build a docker image locally that's also visible to the
minikube/kubernetes, do the following:

1. `eval $(minikube docker-env)`
2. `docker build -t my-new-image .` (will be replaced later with a better name
   if we're sure we want to proceed with this authentication method)

To deploy the built image as a pod:

a) To create deployment for a service account with namespace read-only access
`kubectl apply -f ./configs/deploymentNamespace.yml`

b) To create deployment for a service account with entire cluster read-only
access `kubectl apply -f ./configs/deploymentCluster.yml`

To check if the deployment has been created: `kubectl get deployment`

To check if the pod has been created: `kubectl get pods`

To see the logs: `kubectl logs <pod name>`

To restart everything:

1. Delete the deployment `kubectl delete deployment <name>`

2. Re-deploy using step from the above

To delete service account:
`kubectl delete serviceaccount -n <namespace> <serviceaccount>`

To start cronjob(s) `kubectl apply -f ./configs/cronjob(Cluster|Namespace).yml`

To list cronjobs `kubectl get cronjobs`

To delete cronjob `kubectl delete cronjob <name>`
