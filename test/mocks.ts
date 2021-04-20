import * as k8s from '@kubernetes/client-node';

export function createMockNamespace(): k8s.V1Namespace {
  return {
    metadata: {
      creationTimestamp: new Date('2021-04-27T20:57:17.000Z'),
      managedFields: [
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              'f:phase': {},
            },
          },
          manager: 'kube-apiserver',
          operation: 'Update',
          time: new Date('2021-04-27T20:57:17.000Z'),
        },
      ],
      name: 'example-namespace',
      resourceVersion: '66',
      uid: '55ea52dd-382c-4b8c-8c24-bff59db4b817',
    },
    spec: {
      finalizers: ['kubernetes'],
    },
    status: {
      phase: 'Active',
    },
  };
}

export function createMockDeployment(): k8s.V1Deployment {
  return {
    metadata: {
      annotations: {
        'deployment.kubernetes.io/revision': '1',
      },
      creationTimestamp: new Date('2021-04-13T15:37:33.000Z'),
      generation: 1,
      labels: {
        app: 'kubernetes-bootcamp',
      },
      managedFields: [
        {
          apiVersion: 'apps/v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:labels': {
                '.': {},
                'f:app': {},
              },
            },
            'f:spec': {
              'f:progressDeadlineSeconds': {},
              'f:replicas': {},
              'f:revisionHistoryLimit': {},
              'f:selector': {},
              'f:strategy': {
                'f:rollingUpdate': {
                  '.': {},
                  'f:maxSurge': {},
                  'f:maxUnavailable': {},
                },
                'f:type': {},
              },
              'f:template': {
                'f:metadata': {
                  'f:labels': {
                    '.': {},
                    'f:app': {},
                  },
                },
                'f:spec': {
                  'f:containers': {
                    'k:{"name":"kubernetes-bootcamp"}': {
                      '.': {},
                      'f:image': {},
                      'f:imagePullPolicy': {},
                      'f:name': {},
                      'f:resources': {},
                      'f:terminationMessagePath': {},
                      'f:terminationMessagePolicy': {},
                    },
                  },
                  'f:dnsPolicy': {},
                  'f:restartPolicy': {},
                  'f:schedulerName': {},
                  'f:securityContext': {},
                  'f:terminationGracePeriodSeconds': {},
                },
              },
            },
          },
          manager: 'kubectl-create',
          operation: 'Update',
          time: new Date('2021-04-13T15:37:33.000Z'),
        },
        {
          apiVersion: 'apps/v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:deployment.kubernetes.io/revision': {},
              },
            },
            'f:status': {
              'f:availableReplicas': {},
              'f:conditions': {
                '.': {},
                'k:{"type":"Available"}': {
                  '.': {},
                  'f:lastTransitionTime': {},
                  'f:lastUpdateTime': {},
                  'f:message': {},
                  'f:reason': {},
                  'f:status': {},
                  'f:type': {},
                },
                'k:{"type":"Progressing"}': {
                  '.': {},
                  'f:lastTransitionTime': {},
                  'f:lastUpdateTime': {},
                  'f:message': {},
                  'f:reason': {},
                  'f:status': {},
                  'f:type': {},
                },
              },
              'f:observedGeneration': {},
              'f:readyReplicas': {},
              'f:replicas': {},
              'f:updatedReplicas': {},
            },
          },
          manager: 'kube-controller-manager',
          operation: 'Update',
          time: new Date('2021-04-16T18:10:54.000Z'),
        },
      ],
      name: 'kubernetes-bootcamp',
      namespace: 'default',
      resourceVersion: '92421',
      uid: 'b39ade4b-d8f4-44a9-adc2-dff35d05514c',
    },
    spec: {
      progressDeadlineSeconds: 600,
      replicas: 1,
      revisionHistoryLimit: 10,
      selector: {
        matchLabels: {
          app: 'kubernetes-bootcamp',
        },
      },
      template: {
        metadata: {
          creationTimestamp: undefined,
          labels: {
            app: 'kubernetes-bootcamp',
          },
        },
        spec: {
          containers: [
            {
              image: 'gcr.io/google-samples/kubernetes-bootcamp:v1',
              imagePullPolicy: 'IfNotPresent',
              name: 'kubernetes-bootcamp',
              resources: {},
              terminationMessagePath: '/dev/termination-log',
              terminationMessagePolicy: 'File',
            },
          ],
          dnsPolicy: 'ClusterFirst',
          restartPolicy: 'Always',
          schedulerName: 'default-scheduler',
          securityContext: {},
          terminationGracePeriodSeconds: 30,
        },
      },
    },
    status: {
      availableReplicas: 1,
      conditions: [
        {
          lastTransitionTime: new Date('2021-04-13T15:37:33.000Z'),
          lastUpdateTime: new Date('2021-04-13T15:37:46.000Z'),
          message:
            'ReplicaSet "kubernetes-bootcamp-57978f5f5d" has successfully progressed.',
          reason: 'NewReplicaSetAvailable',
          status: 'True',
          type: 'Progressing',
        },
        {
          lastTransitionTime: new Date('2021-04-16T18:10:54.000Z'),
          lastUpdateTime: new Date('2021-04-16T18:10:54.000Z'),
          message: 'Deployment has minimum availability.',
          reason: 'MinimumReplicasAvailable',
          status: 'True',
          type: 'Available',
        },
      ],
      observedGeneration: 1,
      readyReplicas: 1,
      replicas: 1,
      updatedReplicas: 1,
    },
  };
}

export function createMockNode(): k8s.V1Node {
  return {
    metadata: {
      annotations: {
        'kubeadm.alpha.kubernetes.io/cri-socket': '/var/run/dockershim.sock',
        'node.alpha.kubernetes.io/ttl': '0',
        'volumes.kubernetes.io/controller-managed-attach-detach': 'true',
      },
      creationTimestamp: new Date('2021-04-13T15:20:38.000Z'),
      labels: {
        'beta.kubernetes.io/arch': 'amd64',
        'beta.kubernetes.io/os': 'linux',
        'kubernetes.io/arch': 'amd64',
        'kubernetes.io/hostname': 'minikube',
        'kubernetes.io/os': 'linux',
        'minikube.k8s.io/commit': '15cede53bdc5fe242228853e737333b09d4336b5',
        'minikube.k8s.io/name': 'minikube',
        'minikube.k8s.io/updated_at': '2021_04_13T17_20_41_0700',
        'minikube.k8s.io/version': 'v1.19.0',
        'node-role.kubernetes.io/control-plane': '',
        'node-role.kubernetes.io/master': '',
      },
      managedFields: [
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:volumes.kubernetes.io/controller-managed-attach-detach': {},
              },
              'f:labels': {
                '.': {},
                'f:beta.kubernetes.io/arch': {},
                'f:beta.kubernetes.io/os': {},
                'f:kubernetes.io/arch': {},
                'f:kubernetes.io/hostname': {},
                'f:kubernetes.io/os': {},
              },
            },
            'f:status': {
              'f:addresses': {
                '.': {},
                'k:{"type":"Hostname"}': {
                  '.': {},
                  'f:address': {},
                  'f:type': {},
                },
                'k:{"type":"InternalIP"}': {
                  '.': {},
                  'f:address': {},
                  'f:type': {},
                },
              },
              'f:allocatable': {
                '.': {},
                'f:cpu': {},
                'f:ephemeral-storage': {},
                'f:hugepages-1Gi': {},
                'f:hugepages-2Mi': {},
                'f:memory': {},
                'f:pods': {},
              },
              'f:capacity': {
                '.': {},
                'f:cpu': {},
                'f:ephemeral-storage': {},
                'f:hugepages-1Gi': {},
                'f:hugepages-2Mi': {},
                'f:memory': {},
                'f:pods': {},
              },
              'f:conditions': {
                '.': {},
                'k:{"type":"DiskPressure"}': {
                  '.': {},
                  'f:lastHeartbeatTime': {},
                  'f:lastTransitionTime': {},
                  'f:message': {},
                  'f:reason': {},
                  'f:status': {},
                  'f:type': {},
                },
                'k:{"type":"MemoryPressure"}': {
                  '.': {},
                  'f:lastHeartbeatTime': {},
                  'f:lastTransitionTime': {},
                  'f:message': {},
                  'f:reason': {},
                  'f:status': {},
                  'f:type': {},
                },
                'k:{"type":"PIDPressure"}': {
                  '.': {},
                  'f:lastHeartbeatTime': {},
                  'f:lastTransitionTime': {},
                  'f:message': {},
                  'f:reason': {},
                  'f:status': {},
                  'f:type': {},
                },
                'k:{"type":"Ready"}': {
                  '.': {},
                  'f:lastHeartbeatTime': {},
                  'f:lastTransitionTime': {},
                  'f:message': {},
                  'f:reason': {},
                  'f:status': {},
                  'f:type': {},
                },
              },
              'f:daemonEndpoints': {
                'f:kubeletEndpoint': {
                  'f:Port': {},
                },
              },
              'f:images': {},
              'f:nodeInfo': {
                'f:architecture': {},
                'f:bootID': {},
                'f:containerRuntimeVersion': {},
                'f:kernelVersion': {},
                'f:kubeProxyVersion': {},
                'f:kubeletVersion': {},
                'f:machineID': {},
                'f:operatingSystem': {},
                'f:osImage': {},
                'f:systemUUID': {},
              },
            },
          },
          manager: 'kubelet',
          operation: 'Update',
          time: new Date('2021-04-13T15:20:38.000Z'),
        },
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:kubeadm.alpha.kubernetes.io/cri-socket': {},
              },
              'f:labels': {
                'f:node-role.kubernetes.io/control-plane': {},
                'f:node-role.kubernetes.io/master': {},
              },
            },
          },
          manager: 'kubeadm',
          operation: 'Update',
          time: new Date('2021-04-13T15:20:41.000Z'),
        },
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:labels': {
                'f:minikube.k8s.io/commit': {},
                'f:minikube.k8s.io/name': {},
                'f:minikube.k8s.io/updated_at': {},
                'f:minikube.k8s.io/version': {},
              },
            },
          },
          manager: 'kubectl-label',
          operation: 'Update',
          time: new Date('2021-04-13T15:20:42.000Z'),
        },
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                'f:node.alpha.kubernetes.io/ttl': {},
              },
            },
            'f:spec': {
              'f:podCIDR': {},
              'f:podCIDRs': {
                '.': {},
                'v:"10.10.10.10/24"': {},
              },
            },
          },
          manager: 'kube-controller-manager',
          operation: 'Update',
          time: new Date('2021-04-13T15:20:56.000Z'),
        },
      ],
      name: 'minikube',
      resourceVersion: '81209',
      uid: '103b35d1-8951-455c-95cb-3da4af29bd71',
    },
    spec: {
      podCIDR: '10.10.10.10/24',
      podCIDRs: ['10.10.10.10/24'],
    },
    status: {
      addresses: [
        {
          address: '111.111.11.1',
          type: 'InternalIP',
        },
        {
          address: 'minikube',
          type: 'Hostname',
        },
      ],
      allocatable: {
        cpu: '8',
        'ephemeral-storage': '88103912Ki',
        'hugepages-1Gi': '0',
        'hugepages-2Mi': '0',
        memory: '16289508Ki',
        pods: '110',
      },
      capacity: {
        cpu: '8',
        'ephemeral-storage': '88103912Ki',
        'hugepages-1Gi': '0',
        'hugepages-2Mi': '0',
        memory: '16289508Ki',
        pods: '110',
      },
      conditions: [
        {
          lastHeartbeatTime: new Date('2021-04-15T16:44:09.000Z'),
          lastTransitionTime: new Date('2021-04-13T15:20:33.000Z'),
          message: 'kubelet has sufficient memory available',
          reason: 'KubeletHasSufficientMemory',
          status: 'False',
          type: 'MemoryPressure',
        },
      ],
      daemonEndpoints: {
        kubeletEndpoint: {
          Port: 10250,
        },
      },
      images: [
        {
          names: [
            'k8s.gcr.io/etcd@sha256:4ad90a11b55313b182afc186b9876c8e891531b8db4c9bf1541953021618d0e2',
            'k8s.gcr.io/etcd:3.4.13-0',
          ],
          sizeBytes: 253392289,
        },
      ],
      nodeInfo: {
        architecture: 'amd64',
        bootID: 'a711daa9-dbe2-4923-916c-b8693ced170d',
        containerRuntimeVersion: 'docker://20.10.5',
        kernelVersion: '5.8.0-49-generic',
        kubeProxyVersion: 'v1.20.2',
        kubeletVersion: 'v1.20.2',
        machineID: '73c9fceff7724090ba72b64bf6e8eff8',
        operatingSystem: 'linux',
        osImage: 'Ubuntu 20.04.1 LTS',
        systemUUID: '444a01a7-d999-4a38-a4d9-faaee5ee05f5',
      },
    },
  };
}

export function createMockPod(): k8s.V1Pod {
  return {
    metadata: {
      creationTimestamp: new Date('2021-04-13T15:37:33.000Z'),
      generateName: 'kubernetes-bootcamp-57978f5f5d-',
      labels: {
        app: 'kubernetes-bootcamp',
        'pod-template-hash': '57978f5f5d',
      },
      managedFields: [
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:generateName': {},
              'f:labels': {
                '.': {},
                'f:app': {},
                'f:pod-template-hash': {},
              },
              'f:ownerReferences': {
                '.': {},
                'k:{"uid":"670b166f-b57f-4666-b82d-bae797ebce8d"}': {
                  '.': {},
                  'f:apiVersion': {},
                  'f:blockOwnerDeletion': {},
                  'f:controller': {},
                  'f:kind': {},
                  'f:name': {},
                  'f:uid': {},
                },
              },
            },
            'f:spec': {
              'f:containers': {
                'k:{"name":"kubernetes-bootcamp"}': {
                  '.': {},
                  'f:image': {},
                  'f:imagePullPolicy': {},
                  'f:name': {},
                  'f:resources': {},
                  'f:terminationMessagePath': {},
                  'f:terminationMessagePolicy': {},
                },
              },
              'f:dnsPolicy': {},
              'f:enableServiceLinks': {},
              'f:restartPolicy': {},
              'f:schedulerName': {},
              'f:securityContext': {},
              'f:terminationGracePeriodSeconds': {},
            },
          },
          manager: 'kube-controller-manager',
          operation: 'Update',
          time: new Date('2021-04-13T15:37:33.000Z'),
        },
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:status': {
              'f:conditions': {
                'k:{"type":"ContainersReady"}': {
                  '.': {},
                  'f:lastProbeTime': {},
                  'f:lastTransitionTime': {},
                  'f:status': {},
                  'f:type': {},
                },
                'k:{"type":"Initialized"}': {
                  '.': {},
                  'f:lastProbeTime': {},
                  'f:lastTransitionTime': {},
                  'f:status': {},
                  'f:type': {},
                },
                'k:{"type":"Ready"}': {
                  '.': {},
                  'f:lastProbeTime': {},
                  'f:lastTransitionTime': {},
                  'f:status': {},
                  'f:type': {},
                },
              },
              'f:containerStatuses': {},
              'f:hostIP': {},
              'f:phase': {},
              'f:podIP': {},
              'f:podIPs': {
                '.': {},
                'k:{"ip":"10.10.10.10"}': {
                  '.': {},
                  'f:ip': {},
                },
              },
              'f:startTime': {},
            },
          },
          manager: 'kubelet',
          operation: 'Update',
          time: new Date('2021-04-15T14:03:05.000Z'),
        },
      ],
      name: 'kubernetes-bootcamp-57978f5f5d-pq2sb',
      namespace: 'default',
      ownerReferences: [
        {
          apiVersion: 'apps/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'ReplicaSet',
          name: 'kubernetes-bootcamp-57978f5f5d',
          uid: '670b166f-b57f-4666-b82d-bae797ebce8d',
        },
      ],
      resourceVersion: '74381',
      uid: 'eca213de-5efe-4224-b88a-06abd6eda442',
    },
    spec: {
      containers: [
        {
          image: 'gcr.io/google-samples/kubernetes-bootcamp:v1',
          imagePullPolicy: 'IfNotPresent',
          name: 'kubernetes-bootcamp',
          resources: {},
          terminationMessagePath: '/dev/termination-log',
          terminationMessagePolicy: 'File',
          volumeMounts: [
            {
              mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
              name: 'default-token-87f6f',
              readOnly: true,
            },
          ],
        },
      ],
      dnsPolicy: 'ClusterFirst',
      enableServiceLinks: true,
      nodeName: 'minikube',
      preemptionPolicy: 'PreemptLowerPriority',
      priority: 0,
      restartPolicy: 'Always',
      schedulerName: 'default-scheduler',
      securityContext: {},
      serviceAccount: 'default',
      serviceAccountName: 'default',
      terminationGracePeriodSeconds: 30,
      tolerations: [
        {
          effect: 'NoExecute',
          key: 'node.kubernetes.io/not-ready',
          operator: 'Exists',
          tolerationSeconds: 300,
        },
        {
          effect: 'NoExecute',
          key: 'node.kubernetes.io/unreachable',
          operator: 'Exists',
          tolerationSeconds: 300,
        },
      ],
      volumes: [
        {
          name: 'default-token-87f6f',
          secret: {
            defaultMode: 420,
            secretName: 'default-token-87f6f',
          },
        },
      ],
    },
    status: {
      conditions: [
        {
          lastProbeTime: undefined,
          lastTransitionTime: new Date('2021-04-13T15:37:33.000Z'),
          status: 'True',
          type: 'Initialized',
        },
      ],
      containerStatuses: [
        {
          containerID:
            'docker://d766c0527ed1b455a3ccc0ee3aa9c38f1c75c2607fa29138dc5e7e2266c6702d',
          image: 'gcr.io/google-samples/kubernetes-bootcamp:v1',
          imageID:
            'docker-pullable://gcr.io/google-samples/kubernetes-bootcamp@sha256:0d6b8ee63bb57c5f5b6156f446b3bc3b3c143d233037f3a2f00e279c8fcc64af',
          lastState: {
            terminated: {
              containerID:
                'docker://9c7a252fc7978278d151c962828d9a901c0f12319bcb0e4e2718f2539bf8777b',
              exitCode: 255,
              finishedAt: new Date('2021-04-15T14:02:34.000Z'),
              reason: 'Error',
              startedAt: new Date('2021-04-13T15:37:46.000Z'),
            },
          },
          name: 'kubernetes-bootcamp',
          ready: true,
          restartCount: 1,
          started: true,
          state: {
            running: {
              startedAt: new Date('2021-04-15T14:03:01.000Z'),
            },
          },
        },
      ],
      hostIP: '192.168.22.1',
      phase: 'Running',
      podIP: '10.10.10.10',
      podIPs: [
        {
          ip: '10.10.10.10',
        },
      ],
      qosClass: 'BestEffort',
      startTime: new Date('2021-04-13T15:37:33.000Z'),
    },
  };
}

export function createMockReplicaSet(): k8s.V1ReplicaSet {
  return {
    metadata: {
      annotations: {
        'deployment.kubernetes.io/desired-replicas': '1',
        'deployment.kubernetes.io/max-replicas': '2',
        'deployment.kubernetes.io/revision': '1',
      },
      creationTimestamp: new Date('2021-04-27T20:57:37.000Z'),
      generation: 1,
      labels: {
        'k8s-app': 'kube-dns',
        'pod-template-hash': '74ff55c5b',
      },
      managedFields: [
        {
          apiVersion: 'apps/v1',
          fieldsType: 'FieldsV1',
          manager: 'kube-controller-manager',
          operation: 'Update',
          time: new Date('2021-05-10T13:25:17.000Z'),
        },
      ],
      name: 'coredns-74ff55c5b',
      namespace: 'kube-system',
      ownerReferences: [
        {
          apiVersion: 'apps/v1',
          blockOwnerDeletion: true,
          controller: true,
          kind: 'Deployment',
          name: 'coredns',
          uid: '664fec78-0d67-4bbd-a02d-ad978500e342',
        },
      ],
      resourceVersion: '325114',
      uid: 'f7113c21-7272-4f04-9198-8dc7d682fe23',
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          'k8s-app': 'kube-dns',
          'pod-template-hash': '74ff55c5b',
        },
      },
      template: {
        metadata: {
          creationTimestamp: undefined,
          labels: {
            'k8s-app': 'kube-dns',
            'pod-template-hash': '74ff55c5b',
          },
        },
        spec: {
          containers: [
            {
              args: ['-conf', '/etc/coredns/Corefile'],
              image: 'k8s.gcr.io/coredns:1.7.0',
              imagePullPolicy: 'IfNotPresent',
              livenessProbe: {
                failureThreshold: 5,
                initialDelaySeconds: 60,
                periodSeconds: 10,
                successThreshold: 1,
                timeoutSeconds: 5,
              },
              name: 'coredns',
              ports: [
                {
                  containerPort: 53,
                  name: 'dns',
                  protocol: 'UDP',
                },
                {
                  containerPort: 53,
                  name: 'dns-tcp',
                  protocol: 'TCP',
                },
                {
                  containerPort: 9153,
                  name: 'metrics',
                  protocol: 'TCP',
                },
              ],
              readinessProbe: {
                failureThreshold: 3,
                periodSeconds: 10,
                successThreshold: 1,
                timeoutSeconds: 1,
              },
              resources: {
                limits: {
                  memory: '170Mi',
                },
                requests: {
                  cpu: '100m',
                  memory: '70Mi',
                },
              },
              securityContext: {
                allowPrivilegeEscalation: false,
                capabilities: {
                  add: ['NET_BIND_SERVICE'],
                  drop: ['all'],
                },
                readOnlyRootFilesystem: true,
              },
              terminationMessagePath: '/dev/termination-log',
              terminationMessagePolicy: 'File',
              volumeMounts: [
                {
                  mountPath: '/etc/coredns',
                  name: 'config-volume',
                  readOnly: true,
                },
              ],
            },
          ],
          dnsPolicy: 'Default',
          nodeSelector: {
            'kubernetes.io/os': 'linux',
          },
          priorityClassName: 'system-cluster-critical',
          restartPolicy: 'Always',
          schedulerName: 'default-scheduler',
          securityContext: {},
          serviceAccount: 'coredns',
          serviceAccountName: 'coredns',
          terminationGracePeriodSeconds: 30,
          tolerations: [
            {
              key: 'CriticalAddonsOnly',
              operator: 'Exists',
            },
            {
              effect: 'NoSchedule',
              key: 'node-role.kubernetes.io/master',
            },
            {
              effect: 'NoSchedule',
              key: 'node-role.kubernetes.io/control-plane',
            },
          ],
          volumes: [
            {
              configMap: {
                defaultMode: 420,
                items: [
                  {
                    key: 'Corefile',
                    path: 'Corefile',
                  },
                ],
                name: 'coredns',
              },
              name: 'config-volume',
            },
          ],
        },
      },
    },
    status: {
      availableReplicas: 1,
      fullyLabeledReplicas: 1,
      observedGeneration: 1,
      readyReplicas: 1,
      replicas: 1,
    },
  };
}

export function createMockService(): k8s.V1Service {
  return {
    metadata: {
      creationTimestamp: new Date('2021-04-27T20:57:19.000Z'),
      labels: {
        component: 'apiserver',
        provider: 'kubernetes',
      },
      managedFields: [
        {
          apiVersion: 'v1',
          fieldsType: 'FieldsV1',
          manager: 'kube-apiserver',
          operation: 'Update',
          time: new Date('2021-04-27T20:57:19.000Z'),
        },
      ],
      name: 'kubernetes',
      namespace: 'default',
      resourceVersion: '202',
      uid: 'c296a0d8-9839-4908-bd52-971ddaaebcaf',
    },
    spec: {
      clusterIP: '10.96.0.1',
      clusterIPs: ['10.96.0.1'],
      ports: [
        {
          name: 'https',
          port: 443,
          protocol: 'TCP',
        },
      ],
      sessionAffinity: 'None',
      type: 'ClusterIP',
    },
    status: {
      loadBalancer: {},
    },
  };
}
