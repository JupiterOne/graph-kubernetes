import { fetchFindings } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities } from '../constants';

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
      relationshipSchemaMatchers: [
        // {
        //   _type: Relationships.NAMESPACE_CONTAINS_CONFIGMAP._type,
        //   matcher: {
        //     schema: {
        //       properties: {
        //         _class: { const: RelationshipClass.CONTAINS },
        //         _type: { const: 'kube_namespace_contains_config_map' },
        //       },
        //     },
        //   },
        // },
      ],
    });
  });
});
