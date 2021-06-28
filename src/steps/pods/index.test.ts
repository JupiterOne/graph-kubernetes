import { fetchPods } from '.';
import { fetchNamespaces } from '../namespaces';
import { fetchNodes } from '../nodes';
import { fetchReplicaSets } from '../replica-sets';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchPods', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchPods',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchNodes, fetchReplicaSets, fetchPods],
      entitySchemaMatchers: [
        {
          _type: Entities.POD._type,
          matcher: {
            _class: ['Task'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_pod' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },

                activeDeadlineSeconds: { type: 'number' },
                automountServiceAccountToken: { type: 'boolean' },
                dnsPolicy: { type: 'string' },
                enableServiceLinks: { type: 'boolean' },
                hostIPC: { type: 'boolean' },
                hostNetwork: { type: 'boolean' },
                hostPID: { type: 'boolean' },
                hostname: { type: 'string' },
                nodeName: { type: 'string' },
                preemptionPolicy: { type: 'string' },
                priority: { type: 'number' },
                priorityClassName: { type: 'string' },
                restartPolicy: { type: 'string' },
                runtimeClassName: { type: 'string' },
                schedulerName: { type: 'string' },
                serviceAccount: { type: 'string' },
                serviceAccountName: { type: 'string' },
                setHostnameAsFQDN: { type: 'boolean' },
                shareProcessNamespace: { type: 'boolean' },
                subdomain: { type: 'string' },
                terminationGracePeriodSeconds: { type: 'number' },
                'status.hostIP': { type: 'string' },
                'status.message': { type: 'string' },
                'status.nominatedNodeName': { type: 'string' },
                'status.phase': { type: 'string' },
                'status.podIP': { type: 'string' },
                'status.qosClass': { type: 'string' },
                'status.reason': { type: 'string' },
                'status.startTime': { type: 'number' },
              },
            },
          },
        },
        {
          _type: Entities.CONTAINER._type,
          matcher: {
            _class: ['Container'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_container' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                image: { type: 'string' },
                imagePullPolicy: { type: 'string' },
                terminationMessagePath: { type: 'string' },
                terminationMessagePolicy: { type: 'string' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NODE_HAS_POD._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'kube_node_has_pod' },
              },
            },
          },
        },
        {
          _type: Relationships.POD_CONTAINS_CONTAINER._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_pod_contains_container' },
              },
            },
          },
        },
        {
          _type: Relationships.REPLICASET_MANAGES_POD._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.MANAGES },
                _type: { const: 'kube_replicaset_manages_pod' },
              },
            },
          },
        },
      ],
    });
  });
});
