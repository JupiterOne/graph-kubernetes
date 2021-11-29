import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  RelationshipClass
} from '@jupiterone/integration-sdk-core';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import {
  CLUSTER_ENTITY_DATA_KEY,
  Entities,
  IntegrationSteps,
  Relationships,
} from '../constants';
import { createFindingEntity } from './converters';

interface KubeBenchResults {
  Controls: {
    version: string;
    text: string;
    node_type: string;
    tests: {
      results: {
        test_number: string;
        status: string;
        scored: boolean;
      }[];
    }[]
  }[];
}

export interface Finding {
  version: string;
  testNumber: string;
  status: string;
}

function getFindingData(results: KubeBenchResults): Finding[] {
  const findingData: Finding[] = [];

  for (const control of results.Controls) {
    for (const test of control.tests) {
      for (const result of test.results) {
        findingData.push({
          version: control.version,
          testNumber: result.test_number,
          status: result.status,
        })
      }
    }
  }

  return findingData;
}

export async function fetchFindings(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  console.log('fetchFindings')
  console.log('x', path.join(__dirname, '..', '..', '..', 'result.json'))
  try {
    const result = await readFile(path.join(__dirname, '..', '..', '..', 'result.json'), 'utf-8')
    if (!result) {
      // some logging
      return;
    }

    const resultJson = JSON.parse(result);
    const findings = getFindingData(resultJson);
    console.log('findings', JSON.stringify(findings, null, 4));

    for (const finding of findings) {
      await jobState.addEntity(createFindingEntity(finding));
    }

  } catch(err) {
    console.error(err)
  }
}

export async function buildClusterFindingRelationships(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState } = context;

  const clusterEntity = (await jobState.getData(
    CLUSTER_ENTITY_DATA_KEY,
  )) as Entity;

  await jobState.iterateEntities(
    {
      _type: Entities.FINDINGS._type,
    },
    async (findingEntity) => {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: clusterEntity,
          to: findingEntity,
        }),
      );
    },
  );
}

export const findingsSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.FINDINGS,
    name: 'Fetch Findings',
    entities: [Entities.FINDINGS],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchFindings,
  },
  {
    id: IntegrationSteps.BUILD_CLUSTER_FINDING_RELATIONSHIPS,
    name: 'Build Cluster Finding Relationships',
    entities: [],
    relationships: [Relationships.CLUSTER_HAS_FINDING],
    dependsOn: [IntegrationSteps.CLUSTERS, IntegrationSteps.FINDINGS],
    executionHandler: buildClusterFindingRelationships,
  }
];
