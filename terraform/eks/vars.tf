variable "region" {
  default     = "us-east-2"
  description = "AWS region"
}

variable "cluster_version" {
  default     = "1.21"
  description = "K8s Cluster Version"
}

variable "base_cluster_name" {
  default     = "graph-kubernetes-eks"
  description = "K8s Cluster Name"
}
