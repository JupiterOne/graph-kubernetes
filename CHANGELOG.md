# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Kubernetes Node entities (`kube_node`) now have the following new properties:

  | Property           | Type       |
  | ------------------ | ---------- |
  | `privateIpAddress` | `string[]` |
  | `publicIpAddress`  | `string[]` |
  | `privateDnsName`   | `string`   |
  | `publicDnsName`    | `string`   |
  | `hostname`         | `string`   |
