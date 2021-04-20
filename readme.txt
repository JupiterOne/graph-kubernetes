# RBAC section #
Our goal is to have 2 service accounts. One that will have specific namespace read-only access
and another that'll have an entire cluster read-only access.

Let's create them:
1) kubectl create sa namespace-sa
2) kubectl create sa cluster-sa

Now we need to assign the permissions.

1) To assign namespace read-only access to namespace-sa, run the following:
  kubectl create rolebinding namespace-sa-view --clusterrole=view --serviceaccount=default:namespace-sa --namespace=default

2) To assign entire cluster read-only access to cluster-sa, run the following:
  kubectl apply -f ./configs/clusterRole.yml
  kubectl apply -f ./configs/clusterRoleBinding.yml

# End of RBAC section #

-------------------------------------------------------------------------------------------------------------

# Secret #

Make sure to enter valid values in ./configs/createSecret.yml
Then run kubectl apply -f ./configs/createSecret.yml

# End of secret section $

-------------------------------------------------------------------------------------------------------------

Step 1) Make sure minikube/kubernetes is running

Step 2) To build a docker image that's also visible to the minikube/kubernetes:
  1) eval $(minikube docker-env)
  2) docker build -t my-new-image .

Step 3) Deploy the built image as a pod.
  A) To deploy for service account with namespace read-only access
    kubectl apply -f ./configs/deploymentNamespace.yml
  B) To deploy for service account with entire cluster read-only access
    kubectl apply -f ./configs/deploymentCluster.yml

Step 4)
  1) Check if deployment was created
    kubectl get deployment
  2) Check if pod has been spawned (and see its name)
    kubectl get pods

Step 5) Take a peek at pod's logs
  kubectl logs <pod name>

* To restart everything

Step 1) Delete the deployment
  kubectl delete deployment integration-deployment

<Make code changes>

Step 2) Just repeat all the steps from 2.2 onward

# Bonus #
To delete service account
kubectl delete serviceaccount -n <namespace> <serviceaccount>

To start cronjob(s)
kubectl apply -f ./configs/cronjob(Cluster|Namespace).yml

To list cronjobs
kubectl get cronjobs

To delete cronjob
kubectl delete cronjob <name>