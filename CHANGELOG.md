# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 2.3.4 - 2024-08-26

### Changed

- Added POD Annotation Data property in the same pod entity

## 2.3.3 - 2024-08-22

- Enable PODS step.

## 2.3.2 - 2024-08-13

- Prevent nodes with missing metadata from being created

## 2.3.1 - 2024-07-03

### Changed

- Updated JupiterOne SDK to v13.1.1

## 2.3.0 - 2024-07-02

### Changed

- Updated kube_container_spec entity
- Updated JupiterOne SDk from v8.22.6 to v12.8.3

### Added

- Added new relationships.

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `kube_cron_job`       | **USES**              | `kube_container_spec` |
| `kube_daemon_set`     | **USES**              | `kube_container_spec` |
| `kube_job`            | **USES**              | `kube_container_spec` |
| `kube_replica_set`    | **USES**              | `kube_container_spec` |

## 2.1.0 - 2024-03-22

### Changed

- Fixed tests and recordings

## 2.1.0 - 2024-03-20

### Changed

- Added kube_images entity
- Added kube_node_has_image
- Added kube_replicaset_uses_image

## 2.0.0 - 2024-01-18

### Changed

- upgrade api client to handle k8s server 1.28
- migrate client to singleton pattern

## 1.1.0 - 2022-10-19

### Added

- Added additional properties on the `kube_cluster` entity.

## 1.0.2 - 2022-09-29

- no change, publishing image

## 1.0.1 - 2022-09-28

### Changed

- using jupiterone organization's publish image github workflow on merge to main

## 1.0.0 - 2022-09-01

### Added

The following entities are created:

| Resources                       | Entity `_type`              | Entity `_class` |
| ------------------------------- | --------------------------- | --------------- |
| Kubernetes Cluster              | `kube_cluster`              | `Cluster`       |
| Kubernetes Cluster Role         | `kube_cluster_role`         | `AccessRole`    |
| Kubernetes Cluster Role Binding | `kube_cluster_role_binding` | `AccessPolicy`  |
| Kubernetes ConfigMap            | `kube_config_map`           | `Configuration` |
| Kubernetes Container Spec       | `kube_container_spec`       | `Configuration` |
| Kubernetes CronJob              | `kube_cron_job`             | `Task`          |
| Kubernetes DaemonSet            | `kube_daemon_set`           | `Deployment`    |
| Kubernetes Deployment           | `kube_deployment`           | `Deployment`    |
| Kubernetes Job                  | `kube_job`                  | `Task`          |
| Kubernetes Namespace            | `kube_namespace`            | `Group`         |
| Kubernetes Network Policy       | `kube_network_policy`       | `Configuration` |
| Kubernetes Node                 | `kube_node`                 | `Host`          |
| Kubernetes Pod Security Policy  | `kube_pod_security_policy`  | `Configuration` |
| Kubernetes ReplicaSet           | `kube_replica_set`          | `Deployment`    |
| Kubernetes Role                 | `kube_role`                 | `AccessRole`    |
| Kubernetes Role Binding         | `kube_role_binding`         | `AccessPolicy`  |
| Kubernetes Secret               | `kube_secret`               | `Vault`         |
| Kubernetes Service              | `kube_service`              | `Service`       |
| Kubernetes Service Account      | `kube_service_account`      | `User`          |
| Kubernetes StatefulSet          | `kube_stateful_set`         | `Deployment`    |
| Kubernetes User                 | `kube_user`                 | `User`          |
| Kubernetes Volume               | `kube_volume`               | `Disk`          |

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`       |
| --------------------- | --------------------- | --------------------------- |
| `kube_cluster`        | **CONTAINS**          | `kube_cluster_role`         |
| `kube_cluster`        | **CONTAINS**          | `kube_cluster_role_binding` |
| `kube_cluster`        | **CONTAINS**          | `kube_namespace`            |
| `kube_cluster`        | **CONTAINS**          | `kube_pod_security_policy`  |
| `kube_container_spec` | **USES**              | `kube_volume`               |
| `kube_cron_job`       | **MANAGES**           | `kube_job`                  |
| `kube_deployment`     | **MANAGES**           | `kube_replica_set`          |
| `kube_deployment`     | **USES**              | `kube_container_spec`       |
| `kube_namespace`      | **CONTAINS**          | `kube_config_map`           |
| `kube_namespace`      | **CONTAINS**          | `kube_cron_job`             |
| `kube_namespace`      | **CONTAINS**          | `kube_daemon_set`           |
| `kube_namespace`      | **CONTAINS**          | `kube_deployment`           |
| `kube_namespace`      | **CONTAINS**          | `kube_job`                  |
| `kube_namespace`      | **CONTAINS**          | `kube_network_policy`       |
| `kube_namespace`      | **CONTAINS**          | `kube_replica_set`          |
| `kube_namespace`      | **CONTAINS**          | `kube_role`                 |
| `kube_namespace`      | **CONTAINS**          | `kube_role_binding`         |
| `kube_namespace`      | **CONTAINS**          | `kube_secret`               |
| `kube_namespace`      | **CONTAINS**          | `kube_service`              |
| `kube_namespace`      | **CONTAINS**          | `kube_service_account`      |
| `kube_namespace`      | **CONTAINS**          | `kube_stateful_set`         |

The following mapped relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type`        | Direction |
| --------------------- | --------------------- | ---------------------------- | --------- |
| `kube_cluster`        | **IS**                | `*azure_kubernetes_cluster*` | FORWARD   |
| `kube_cluster`        | **IS**                | `*google_container_cluster*` | FORWARD   |
