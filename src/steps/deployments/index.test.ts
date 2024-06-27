import { fetchDeployments } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchDeployments', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchDeployments',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchDeployments],
      entitySchemaMatchers: [
        {
          _type: Entities.DEPLOYMENT._type,
          matcher: {
            _class: ['Deployment'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_deployment' },
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

                minReadySeconds: { type: 'number' },
                paused: { type: 'boolean' },
                progressDeadlineSeconds: { type: 'number' },
                replicas: { type: 'number' },
                revisionHistoryLimit: { type: 'number' },
                'strategy.type': { type: 'string' },
                'strategy.maxSurge': { type: 'string' },
                'strategy.maxUnavailable': { type: ['string', 'number'] },
                'status.availableReplicas': { type: 'number' },
                'status.collisionCount': { type: 'number' },
                'status.observedGeneration': { type: 'number' },
                'status.readyReplicas': { type: 'number' },
                'status.replicas': { type: 'number' },
                'status.unavailableReplicas': { type: 'number' },
                'status.updatedReplicas': { type: 'number' },
              },
            },
          },
        },
        {
          _type: Entities.CONTAINER_SPEC._type,
          matcher: {
            _class: ['Configuration'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_container_spec' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                image: { type: 'string' },
                imagePullPolicy: { type: 'string' },
                'securityContext.allowPrivilegeEscalation': { type: 'boolean' },
                'securityContext.privileged': { type: 'boolean' },
                'securityContext.procMount': { type: 'string' },
                'securityContext.readOnlyRootFilesystem': { type: 'boolean' },
                'securityContext.runAsGroup': { type: 'number' },
                'securityContext.runAsNonRoot': { type: 'boolean' },
                'securityContext.runAsUser': { type: 'number' },
              },
            },
          },
        },
        {
          _type: Entities.VOLUME._type,
          matcher: {
            _class: ['Disk'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_volume' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                'ephemeral.readOnly': { type: 'boolean' },
                'hostPath.path': { type: 'string' },
                'hostPath.type': { type: 'string' },
                classification: { const: null },
                encrypted: { type: 'boolean' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_DEPLOYMENT._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_deployment' },
              },
            },
          },
        },
        {
          _type: Relationships.DEPLOYMENT_USES_CONTAINER_SPEC._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.USES },
                _type: { const: 'kube_deployment_uses_container_spec' },
              },
            },
          },
        },
        {
          _type: Relationships.CONTAINER_SPEC_USES_VOLUME._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.USES },
                _type: { const: 'kube_container_spec_uses_volume' },
                readOnly: { type: 'boolean' },
                mountPath: { type: 'string' },
                mountPropagation: { type: 'string' },
                subPath: { type: 'string' },
              },
            },
          },
        },
      ],
    });
  });
});
