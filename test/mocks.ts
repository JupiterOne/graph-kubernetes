import * as k8s from '@kubernetes/client-node';

export function createMockNamespace(): Partial<k8s.V1Namespace> {
  return {
    metadata: {
      creationTimestamp: new Date('2021-04-27T20:57:17.000Z'),
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

export function createMockDeployment(): Partial<k8s.V1Deployment> {
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

export function createMockNode(): Partial<k8s.V1Node> {
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

export function createMockServiceAccount(): Partial<k8s.V1ServiceAccount> {
  return {
    metadata: {
      creationTimestamp: new Date('2021-12-03T19:01:12.000Z'),
      name: 'ttl-controller',
      namespace: 'kube-system',
      resourceVersion: '236',
      uid: 'a9e0bedc-2bcf-4fe2-9414-5fe1d03121c6',
    },
  };
}

export function createMockPod(): Partial<k8s.V1Pod> {
  return {
    metadata: {
      creationTimestamp: new Date('2021-04-13T15:37:33.000Z'),
      generateName: 'kubernetes-bootcamp-57978f5f5d-',
      labels: {
        app: 'kubernetes-bootcamp',
        'pod-template-hash': '57978f5f5d',
      },
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

export function createMockReplicaSet(): Partial<k8s.V1ReplicaSet> {
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

export function createMockService(): Partial<k8s.V1Service> {
  return {
    metadata: {
      creationTimestamp: new Date('2021-04-27T20:57:19.000Z'),
      labels: {
        component: 'apiserver',
        provider: 'kubernetes',
      },
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

export function createMockConfigMap(): Partial<k8s.V1ConfigMap> {
  return {
    data: {
      kubelet: 'some data',
    },
    metadata: {
      creationTimestamp: new Date('2021-04-27T20:57:19.000Z'),
      name: 'kubelet-config-1.20',
      namespace: 'kube-system',
      resourceVersion: '207',
      uid: '7deda7f2-2ac1-4845-836f-e0984840243b',
    },
  };
}

export function createMockCronJob(): Partial<k8s.V1beta1CronJob> {
  return {
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"batch/v1beta1","kind":"CronJob","metadata":{"annotations":{},"name":"hello","namespace":"default"},"spec":{"jobTemplate":{"spec":{"template":{"spec":{"containers":[{"command":["/bin/sh","-c","date; echo Hello from the Kubernetes cluster"],"image":"busybox","imagePullPolicy":"IfNotPresent","name":"hello"}],"restartPolicy":"OnFailure"}}}},"schedule":"*/1 * * * *"}}\n',
      },
      creationTimestamp: new Date('2021-06-23T13:09:30.000Z'),
      name: 'hello',
      namespace: 'default',
      resourceVersion: '572357',
      uid: '223aa203-ed63-4c0e-a113-99abfe9d48e6',
    },
    spec: {
      concurrencyPolicy: 'Allow',
      failedJobsHistoryLimit: 1,
      jobTemplate: {
        metadata: {},
        spec: {
          template: {
            metadata: {},
            spec: {
              containers: [
                {
                  command: [
                    '/bin/sh',
                    '-c',
                    'date; echo Hello from the Kubernetes cluster',
                  ],
                  image: 'busybox',
                  imagePullPolicy: 'IfNotPresent',
                  name: 'hello',
                  resources: {},
                  terminationMessagePath: '/dev/termination-log',
                  terminationMessagePolicy: 'File',
                },
              ],
              dnsPolicy: 'ClusterFirst',
              restartPolicy: 'OnFailure',
              schedulerName: 'default-scheduler',
              securityContext: {},
              terminationGracePeriodSeconds: 30,
            },
          },
        },
      },
      schedule: '*/1 * * * *',
      successfulJobsHistoryLimit: 3,
      suspend: false,
    },
    status: {
      lastScheduleTime: new Date('2021-06-23T17:56:00.000Z'),
    },
  };
}

export function createMockDaemonSet(): Partial<k8s.V1DaemonSet> {
  return {
    metadata: {
      annotations: {
        'deprecated.daemonset.template.generation': '1',
      },
      creationTimestamp: new Date('2021-04-27T20:57:20.000Z'),
      generation: 1,
      labels: {
        'k8s-app': 'kube-proxy',
      },
      name: 'kube-proxy',
      namespace: 'kube-system',
      resourceVersion: '532760',
      uid: '597716cf-e9a9-4b1c-9107-a18e054b00da',
    },
    spec: {
      revisionHistoryLimit: 10,
      selector: {
        matchLabels: {
          'k8s-app': 'kube-proxy',
        },
      },
      template: {
        metadata: {
          labels: {
            'k8s-app': 'kube-proxy',
          },
        },
        spec: {
          containers: [
            {
              command: [
                '/usr/local/bin/kube-proxy',
                '--config=/var/lib/kube-proxy/config.conf',
                '--hostname-override=$(NODE_NAME)',
              ],
              env: [
                {
                  name: 'NODE_NAME',
                  valueFrom: {
                    fieldRef: {
                      apiVersion: 'v1',
                      fieldPath: 'spec.nodeName',
                    },
                  },
                },
              ],
              image: 'k8s.gcr.io/kube-proxy:v1.20.2',
              imagePullPolicy: 'IfNotPresent',
              name: 'kube-proxy',
              resources: {},
              securityContext: {
                privileged: true,
              },
              terminationMessagePath: '/dev/termination-log',
              terminationMessagePolicy: 'File',
              volumeMounts: [
                {
                  mountPath: '/var/lib/kube-proxy',
                  name: 'kube-proxy',
                },
                {
                  mountPath: '/run/xtables.lock',
                  name: 'xtables-lock',
                },
                {
                  mountPath: '/lib/modules',
                  name: 'lib-modules',
                  readOnly: true,
                },
              ],
            },
          ],
          dnsPolicy: 'ClusterFirst',
          hostNetwork: true,
          nodeSelector: {
            'kubernetes.io/os': 'linux',
          },
          priorityClassName: 'system-node-critical',
          restartPolicy: 'Always',
          schedulerName: 'default-scheduler',
          securityContext: {},
          serviceAccount: 'kube-proxy',
          serviceAccountName: 'kube-proxy',
          terminationGracePeriodSeconds: 30,
          tolerations: [
            {
              key: 'CriticalAddonsOnly',
              operator: 'Exists',
            },
            {
              operator: 'Exists',
            },
          ],
          volumes: [
            {
              configMap: {
                defaultMode: 420,
                name: 'kube-proxy',
              },
              name: 'kube-proxy',
            },
            {
              hostPath: {
                path: '/run/xtables.lock',
                type: 'FileOrCreate',
              },
              name: 'xtables-lock',
            },
            {
              hostPath: {
                path: '/lib/modules',
                type: '',
              },
              name: 'lib-modules',
            },
          ],
        },
      },
      updateStrategy: {
        rollingUpdate: {},
        type: 'RollingUpdate',
      },
    },
    status: {
      currentNumberScheduled: 1,
      desiredNumberScheduled: 1,
      numberAvailable: 1,
      numberMisscheduled: 0,
      numberReady: 1,
      observedGeneration: 1,
      updatedNumberScheduled: 1,
    },
  };
}

export function createMockJob(): Partial<k8s.V1Job> {
  return {
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"batch/v1","kind":"Job","metadata":{"annotations":{},"name":"pi","namespace":"default"},"spec":{"backoffLimit":4,"template":{"spec":{"containers":[{"command":["perl","-Mbignum=bpi","-wle","print bpi(2000)"],"image":"perl","name":"pi"}],"restartPolicy":"Never"}}}}\n',
      },
      creationTimestamp: new Date('2021-06-23T12:52:25.000Z'),
      labels: {
        'controller-uid': '52f2fb4f-ab4b-4699-9e05-17571079a43f',
        'job-name': 'pi',
      },
      name: 'pi',
      namespace: 'default',
      resourceVersion: '553808',
      uid: '52f2fb4f-ab4b-4699-9e05-17571079a43f',
    },
    spec: {
      backoffLimit: 4,
      completions: 1,
      parallelism: 1,
      selector: {
        matchLabels: {
          'controller-uid': '52f2fb4f-ab4b-4699-9e05-17571079a43f',
        },
      },
      template: {
        metadata: {
          labels: {
            'controller-uid': '52f2fb4f-ab4b-4699-9e05-17571079a43f',
            'job-name': 'pi',
          },
        },
        spec: {
          containers: [
            {
              command: ['perl', '-Mbignum=bpi', '-wle', 'print bpi(2000)'],
              image: 'perl',
              imagePullPolicy: 'Always',
              name: 'pi',
              resources: {},
              terminationMessagePath: '/dev/termination-log',
              terminationMessagePolicy: 'File',
            },
          ],
          dnsPolicy: 'ClusterFirst',
          restartPolicy: 'Never',
          schedulerName: 'default-scheduler',
          securityContext: {},
          terminationGracePeriodSeconds: 30,
        },
      },
    },
    status: {
      completionTime: new Date('2021-06-23T12:52:35.000Z'),
      conditions: [
        {
          lastProbeTime: new Date('2021-06-23T12:52:35.000Z'),
          lastTransitionTime: new Date('2021-06-23T12:52:35.000Z'),
          status: 'True',
          type: 'Complete',
        },
      ],
      startTime: new Date('2021-06-23T12:52:25.000Z'),
      succeeded: 1,
    },
  };
}

export function createMockSecret(): Partial<k8s.V1Secret> {
  return {
    data: {
      'some-field': 'some-value',
    },
    metadata: {
      annotations: {
        'kubernetes.io/service-account.name': 'ttl-controller',
        'kubernetes.io/service-account.uid':
          'ce40aed7-b0ba-43bf-ab90-a9fb53f8ba03',
      },
      creationTimestamp: new Date('2021-04-27T20:57:34.000Z'),
      name: 'ttl-controller-token-r2999',
      namespace: 'kube-system',
      resourceVersion: '345',
      uid: '35ac86f2-63cc-4c48-a05e-ad94ab9dcad5',
    },
    type: 'kubernetes.io/service-account-token',
  };
}

export function createMockRole(): Partial<k8s.V1Role> {
  return {
    metadata: {
      creationTimestamp: new Date('2021-12-03T19:01:11.000Z'),
      managedFields: [
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:rules': {},
          },
          manager: 'kubeadm',
          operation: 'Update',
          time: new Date('2021-12-03T19:01:11.000Z'),
        },
      ],
      name: 'kubeadm:nodes-kubeadm-config',
      namespace: 'kube-system',
      resourceVersion: '210',
      uid: '5fce2a47-3e00-4401-8721-430b00892821',
    },
    rules: [
      {
        apiGroups: [''],
        resourceNames: ['kubeadm-config'],
        resources: ['configmaps'],
        verbs: ['get'],
      },
    ],
  };
}

export function createMockClusterRole(): Partial<k8s.V1ClusterRole> {
  return {
    metadata: {
      annotations: {
        'rbac.authorization.kubernetes.io/autoupdate': 'true',
      },
      creationTimestamp: new Date('2021-12-03T19:01:11.000Z'),
      labels: {
        'kubernetes.io/bootstrapping': 'rbac-defaults',
      },
      managedFields: [
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:rbac.authorization.kubernetes.io/autoupdate': {},
              },
              'f:labels': {
                '.': {},
                'f:kubernetes.io/bootstrapping': {},
              },
            },
            'f:rules': {},
          },
          manager: 'kube-apiserver',
          operation: 'Update',
          time: new Date('2021-12-03T19:01:11.000Z'),
        },
      ],
      name: 'system:volume-scheduler',
      resourceVersion: '108',
      uid: '05a66ca8-1f55-4799-81b0-4bf54dbf4cde',
    },
    rules: [
      {
        apiGroups: [''],
        resources: ['persistentvolumes'],
        verbs: ['get', 'list', 'patch', 'update', 'watch'],
      },
      {
        apiGroups: ['storage.k8s.io'],
        resources: ['storageclasses'],
        verbs: ['get', 'list', 'watch'],
      },
      {
        apiGroups: [''],
        resources: ['persistentvolumeclaims'],
        verbs: ['get', 'list', 'patch', 'update', 'watch'],
      },
    ],
  };
}

export function createMockRoleBinding(): Partial<k8s.V1RoleBinding> {
  return {
    metadata: {
      annotations: {
        'rbac.authorization.kubernetes.io/autoupdate': 'true',
      },
      creationTimestamp: new Date('2021-12-03T19:01:11.000Z'),
      labels: {
        'kubernetes.io/bootstrapping': 'rbac-defaults',
      },
      managedFields: [
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:rbac.authorization.kubernetes.io/autoupdate': {},
              },
              'f:labels': {
                '.': {},
                'f:kubernetes.io/bootstrapping': {},
              },
            },
            'f:roleRef': {},
            'f:subjects': {},
          },
          manager: 'kube-apiserver',
          operation: 'Update',
          time: new Date('2021-12-03T19:01:11.000Z'),
        },
      ],
      name: 'system:controller:token-cleaner',
      namespace: 'kube-system',
      resourceVersion: '202',
      uid: '1ca98118-90ac-4160-9b5d-d4672b774ffc',
    },
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: 'Role',
      name: 'system:controller:token-cleaner',
    },
    subjects: [
      {
        kind: 'ServiceAccount',
        name: 'token-cleaner',
        namespace: 'kube-system',
      },
    ],
  };
}

export function createClusterRoleBinding(): Partial<k8s.V1ClusterRoleBinding> {
  return {
    metadata: {
      annotations: {
        'rbac.authorization.kubernetes.io/autoupdate': 'true',
      },
      creationTimestamp: new Date('2021-12-03T19:01:11.000Z'),
      labels: {
        'kubernetes.io/bootstrapping': 'rbac-defaults',
      },
      managedFields: [
        {
          apiVersion: 'rbac.authorization.k8s.io/v1',
          fieldsType: 'FieldsV1',
          fieldsV1: {
            'f:metadata': {
              'f:annotations': {
                '.': {},
                'f:rbac.authorization.kubernetes.io/autoupdate': {},
              },
              'f:labels': {
                '.': {},
                'f:kubernetes.io/bootstrapping': {},
              },
            },
            'f:roleRef': {},
            'f:subjects': {},
          },
          manager: 'kube-apiserver',
          operation: 'Update',
          time: new Date('2021-12-03T19:01:11.000Z'),
        },
      ],
      name: 'system:volume-scheduler',
      resourceVersion: '156',
      uid: '073806b3-7440-4e55-bbb5-d492a44e318d',
    },
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: 'ClusterRole',
      name: 'system:volume-scheduler',
    },
    subjects: [
      {
        apiGroup: 'rbac.authorization.k8s.io',
        kind: 'User',
        name: 'system:kube-scheduler',
      },
    ],
  };
}

export function createMockStatefulSet(): Partial<k8s.V1StatefulSet> {
  return {
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"apps/v1","kind":"StatefulSet","metadata":{"annotations":{},"name":"web","namespace":"default"},"spec":{"replicas":3,"selector":{"matchLabels":{"app":"nginx"}},"serviceName":"nginx","template":{"metadata":{"labels":{"app":"nginx"}},"spec":{"containers":[{"image":"k8s.gcr.io/nginx-slim:0.8","name":"nginx","ports":[{"containerPort":80,"name":"web"}],"volumeMounts":[{"mountPath":"/usr/share/nginx/html","name":"www"}]}],"terminationGracePeriodSeconds":10}},"volumeClaimTemplates":[{"metadata":{"name":"www"},"spec":{"accessModes":["ReadWriteOnce"],"resources":{"requests":{"storage":"1Gi"}},"storageClassName":"my-storage-class"}}]}}\n',
      },
      creationTimestamp: new Date('2021-06-21T09:21:04.000Z'),
      generation: 1,
      name: 'web',
      namespace: 'default',
      resourceVersion: '508551',
      uid: 'f34830bc-9c50-47d1-a77f-0f527cb95511',
    },
    spec: {
      podManagementPolicy: 'OrderedReady',
      replicas: 3,
      revisionHistoryLimit: 10,
      selector: {
        matchLabels: {
          app: 'nginx',
        },
      },
      serviceName: 'nginx',
      template: {
        metadata: {
          labels: {
            app: 'nginx',
          },
        },
        spec: {
          containers: [
            {
              image: 'k8s.gcr.io/nginx-slim:0.8',
              imagePullPolicy: 'IfNotPresent',
              name: 'nginx',
              ports: [
                {
                  containerPort: 80,
                  name: 'web',
                  protocol: 'TCP',
                },
              ],
              resources: {},
              terminationMessagePath: '/dev/termination-log',
              terminationMessagePolicy: 'File',
              volumeMounts: [
                {
                  mountPath: '/usr/share/nginx/html',
                  name: 'www',
                },
              ],
            },
          ],
          dnsPolicy: 'ClusterFirst',
          restartPolicy: 'Always',
          schedulerName: 'default-scheduler',
          securityContext: {},
          terminationGracePeriodSeconds: 10,
        },
      },
      updateStrategy: {
        rollingUpdate: {
          partition: 0,
        },
        type: 'RollingUpdate',
      },
      volumeClaimTemplates: [
        {
          apiVersion: 'v1',
          kind: 'PersistentVolumeClaim',
          metadata: {
            name: 'www',
          },
          spec: {
            accessModes: ['ReadWriteOnce'],
            resources: {
              requests: {
                storage: '1Gi',
              },
            },
            storageClassName: 'my-storage-class',
            volumeMode: 'Filesystem',
          },
          status: {
            phase: 'Pending',
          },
        },
      ],
    },
    status: {
      collisionCount: 0,
      currentReplicas: 1,
      currentRevision: 'web-6596ffb49b',
      observedGeneration: 1,
      replicas: 1,
      updateRevision: 'web-6596ffb49b',
      updatedReplicas: 1,
    },
  };
}
