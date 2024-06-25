import { buildContainerSpecJobRelationship, fetchJobs } from '.';
import { fetchCronJobs } from '../cron-jobs';
import { fetchNamespaces } from '../namespaces';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchJobs1', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchJobs',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [
        fetchNamespaces,
        fetchCronJobs,
        fetchJobs,
        buildContainerSpecJobRelationship,
      ],
      entitySchemaMatchers: [
        {
          _type: Entities.JOB._type,
          matcher: {
            _class: ['Task'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_job' },
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

                activeDeadlineSeconds: { type: 'number' },
                backoffLimit: { type: 'number' },
                completions: { type: 'number' },
                manualSelector: { type: 'boolean' },
                parallelism: { type: 'number' },
                ttlSecondsAfterFinished: { type: 'number' },
                'status.active': { type: 'number' },
                'status.startTime': { type: 'number' },
                'status.completionTime': { type: 'number' },
                'status.failed': { type: 'number' },
                'status.succeeded': { type: 'number' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.NAMESPACE_CONTAINS_JOB._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.CONTAINS },
                _type: { const: 'kube_namespace_contains_job' },
              },
            },
          },
        },
        {
          _type: Relationships.CRONJOB_MANAGES_JOB._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.MANAGES },
                _type: { const: 'kube_cron_job_manages_job' },
              },
            },
          },
        },
        {
          _type: Relationships.CONTAINER_SPEC_HAS_JOB._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'kube_container_spec_has_job' },
              },
            },
          },
        },
      ],
    });
  }, 500000);
});
