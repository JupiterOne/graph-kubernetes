# Integration with JupiterOne

## Kubernetes + JupiterOne Integration Benefits

TODO: Iterate the benefits of ingesting data from the provider into JupiterOne.
Consider the following examples:

- Visualize Kubernetes resources in the JupiterOne graph.
- Monitor changes using JupiterOne alerts.

## How it Works

TODO: Iterate significant activities the integration enables. Consider the
following examples:

- JupiterOne periodically fetches resources from Kubernetes to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph.
- Configure alerts to take action when JupiterOne graph changes.

## Requirements

- A running Kubernetes cluster. This integration will be deployed as a pod and
  interact with Kuberenetes API server.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

Todo: Some section about finding the k8s integration docker image

### In JupiterOne

TODO: List specific actions that must be taken in JupiterOne. Many of the
following steps will be reusable; take care to be sure they remain accurate.

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Kubernetes** integration tile and click it.
3. Click the **Add Configuration** button.
4. Enter the **Account Name** by which you'd like to identify this Kubernetes
   account in JupiterOne. Ingested entities will have this value stored in
   `tag.AccountName` when **Tag with Account Name** is checked.
5. Enter a **Description** that will further assist your team when identifying
   the integration instance.
6. Select a **Polling Interval** that you feel is sufficient for your monitoring
   needs. You may leave this as `DISABLED` and manually execute the integration.
7. Enter the **Kubernetes API Key** generated for use by JupiterOne.
8. Click **Create Configuration** once all values are provided.

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

https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources             | Entity `_type`    | Entity `_class` |
| --------------------- | ----------------- | --------------- |
| Kubernetes Container  | `kube_container`  | `Container`     |
| Kubernetes Deployment | `kube_deployment` | `Configuration` |
| Kubernetes Namespace  | `kube_namespace`  | `Group`         |
| Kubernetes Node       | `kube_node`       | `Group`         |
| Kubernetes Pod        | `kube_pod`        | `Group`         |
| Kubernetes ReplicaSet | `kube_replicaset` | `Configuration` |
| Kubernetes Service    | `kube_service`    | `Service`       |

### Relationships

The following relationships are created/mapped:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `kube_deployment`     | **HAS**               | `kube_replicaset`     |
| `kube_namespace`      | **HAS**               | `kube_deployment`     |
| `kube_namespace`      | **HAS**               | `kube_service`        |
| `kube_node`           | **HAS**               | `kube_pod`            |
| `kube_pod`            | **HAS**               | `kube_container`      |
| `kube_replicaset`     | **HAS**               | `kube_pod`            |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
