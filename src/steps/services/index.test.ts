import { fetchServices } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchServices', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchServices',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNamespaces, fetchServices],
      entitySchemaMatchers: [
        {
          _type: Entities.SERVICE._type,
          matcher: {
            _class: ['Service'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_service' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                category: {
                  type: 'array',
                  items: { type: 'string' },
                },
                createdOn: { type: 'number' },

                allocateLoadBalancerNodePorts: { type: 'boolean' },
                clusterIP: { type: 'string' },
                clusterIPs: {
                  type: 'array',
                  items: { type: 'string' },
                },
                externalIPs: {
                  type: 'array',
                  items: { type: 'string' },
                },
                externalName: { type: 'string' },
                externalTrafficPolicy: { type: 'string' },
                healthCheckNodePort: { type: 'number' },
                ipFamilies: {
                  type: 'array',
                  items: { type: 'string' },
                },
                ipFamilyPolicy: { type: 'string' },
                loadBalancerIP: { type: 'string' },
                loadBalancerSourceRanges: {
                  type: 'array',
                  items: { type: 'string' },
                },
                publishNotReadyAddresses: { type: 'boolean' },
                sessionAffinity: { type: 'string' },
                type: { type: 'string' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_HAS_SERVICE._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'kube_namespace_has_service' },
              },
            },
          },
        },
      ],
    });
  });
});
