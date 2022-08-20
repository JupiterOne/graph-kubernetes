import { fetchFindings } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities, Relationships } from '../constants';
import { fetchClusterDetails } from '../clusters';
import { RelationshipClass } from '@jupiterone/data-model';

describe('#fetchFindings', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchFindings',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchFindings],
      entitySchemaMatchers: [
        {
          _type: Entities.FINDINGS._type,
          matcher: {
            _class: ['Finding'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_finding' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                active: { type: 'boolean' },
                complianceStandardName: { type: 'string' },
                complianceStandardVersion: { type: 'string' },
                complianceStandardRequirement: { type: 'string' },
                status: { type: 'string' },
                category: { type: 'string' },
                severity: { type: 'string' },
                numericSeverity: { type: 'number' },
                open: { type: 'boolean' },
              },
            },
          },
        },
      ],
      relationshipSchemaMatchers: [],
    });
  });
});

describe('#buildClusterFindingRelationships', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'buildClusterFindingRelationships',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchClusterDetails, fetchFindings],
      entitySchemaMatchers: [],
      relationshipSchemaMatchers: [
        {
          _type: Relationships.CLUSTER_HAS_FINDING._type,
          matcher: {
            schema: {
              properties: {
                _class: { const: RelationshipClass.HAS },
                _type: { const: 'kube_cluster_has_finding' },
              },
            },
          },
        },
      ],
    });
  });
});
