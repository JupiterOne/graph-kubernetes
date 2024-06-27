import { buildContainerSpecCronJobRelationship, fetchCronJobs } from '.';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchCronJobs', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchCronJobs',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [
        fetchNamespaces,
        fetchCronJobs,
        buildContainerSpecCronJobRelationship,
      ],
      entitySchemaMatchers: [
        {
          _type: Entities.CRONJOB._type,
          matcher: {
            _class: ['Task'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_cron_job' },
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
                deletedOn: { type: 'number' },

                concurrencyPolicy: { type: 'string' },
                failedJobsHistoryLimit: { type: 'number' },
                schedule: { type: 'string' },
                startingDeadlineSeconds: { type: 'number' },
                successfulJobsHistoryLimit: { type: 'number' },
                suspend: { type: 'boolean' },
                'status.lastScheduleTime': { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_CRONJOB._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_cron_job' },
              },
            },
          },
        },
        {
          _type: Relationships.CONTAINER_SPEC_HAS_CRONJOB._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'kube_container_spec_has_cron_job' },
              },
            },
          },
        },
      ],
    });
  });
});
