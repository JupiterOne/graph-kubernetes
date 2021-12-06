import {
  fetchClusterRoleBindings,
  fetchClusterRoles,
  fetchRoleBindings,
  fetchRoles,
} from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';
import { fetchClusterDetails } from '../clusters';

describe('#fetchRoles', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchRoles',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchRoles],
      entitySchemaMatchers: [
        {
          _type: Entities.ROLE._type,
          matcher: {
            _class: ['AccessRole'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_role' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                namespace: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_ROLE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_role' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#fetchClusterRoles', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchClusterRoles',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchClusterDetails, fetchClusterRoles],
      entitySchemaMatchers: [
        {
          _type: Entities.CLUSTER_ROLE._type,
          matcher: {
            _class: ['AccessRole'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_cluster_role' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                namespace: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.CLUSTER_CONTAINS_CLUSTER_ROLE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_cluster_contains_cluster_role' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#fetchRoleBindings', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchRoleBindings',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchRoleBindings],
      entitySchemaMatchers: [
        {
          _type: Entities.ROLE_BINDING._type,
          matcher: {
            _class: ['AccessPolicy'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_role_binding' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                namespace: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_ROLE_BINDING._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_role_binding' },
              },
            },
          },
        },
      ],
    });
  });
});

describe('#fetchClusterRoleBindings', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchClusterRoleBindings',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchClusterDetails, fetchClusterRoleBindings],
      entitySchemaMatchers: [
        {
          _type: Entities.ROLE_BINDING._type,
          matcher: {
            _class: ['AccessPolicy'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_cluster_role_binding' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                namespace: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.CLUSTER_CONTAINS_CLUSTER_ROLE_BINDING._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_cluster_contains_cluster_role_binding' },
              },
            },
          },
        },
      ],
    });
  });
});
