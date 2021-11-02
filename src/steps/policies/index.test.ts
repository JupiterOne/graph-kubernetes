import { fetchPodSecurityPolicies } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { fetchClusterDetails } from '../clusters';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchPodSecurityPolicies', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchPodSecurityPolicies',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchClusterDetails, fetchPodSecurityPolicies],
      entitySchemaMatchers: [
        {
          _type: Entities.POD_SECURITY_POLICY._type,
          matcher: {
            _class: ['Configuration'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_pod_security_policy' },
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

                allowPrivilegeEscalation: { type: 'boolean' },
                allowedCapabilities: {
                  type: 'array',
                  items: { type: 'string' },
                },
                allowedProcMountTypes: {
                  type: 'array',
                  items: { type: 'string' },
                },
                allowedUnsafeSysctls: {
                  type: 'array',
                  items: { type: 'string' },
                },
                defaultAddCapabilities: {
                  type: 'array',
                  items: { type: 'string' },
                },
                defaultAllowPrivilegeEscalation: { type: 'boolean' },
                forbiddenSysctls: { type: 'array', items: { type: 'string' } },
                hostIPC: { type: 'boolean' },
                hostNetwork: { type: 'boolean' },
                hostPID: { type: 'boolean' },
                privileged: { type: 'boolean' },
                readOnlyRootFilesystem: { type: 'boolean' },
                requiredDropCapabilities: {
                  type: 'array',
                  items: { type: 'string' },
                },
                'runAsGroup.range': {
                  type: 'array',
                  items: { type: 'string' },
                },
                'runAsGroup.rule': { type: 'string' },
                'runAsUser.range': { type: 'array', items: { type: 'string' } },
                'runAsUser.rule': { type: 'string' },
                'runtimeClass.allowedRuntimeClassNames': {
                  type: 'array',
                  items: { type: 'string' },
                },
                'runtimeClass.defaultRuntimeClassName': { type: 'string' },
                'seLinux.rule': { type: 'string' },
                'seLinux.seLinuxOptions.level': { type: 'string' },
                'seLinux.seLinuxOptions.role': { type: 'string' },
                'seLinux.seLinuxOptions.type': { type: 'string' },
                'seLinux.seLinuxOptions.user': { type: 'string' },
                'supplementalGroups.range': {
                  type: 'array',
                  items: { type: 'string' },
                },
                'supplementalGroups.rule': { type: 'string' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.CLUSTER_CONTAINS_POD_SECURITY_POLICY._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_cluster_contains_pod_security_policy' },
              },
            },
          },
        },
      ],
    });
  });
});
