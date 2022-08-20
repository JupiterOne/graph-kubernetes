import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Finding } from '.';
import { Entities } from '../constants';

function getFindingKey(version: string, testNumber: string) {
  return `kube_finding:${version}:${testNumber}`;
}

function getSeverity(finding: Finding) {
  // TODO, somehow..
  return 'informational';
}

function getNumericSeverity(finding: Finding) {
  // TODO, somehow..
  return 1;
}

export function createFindingEntity(finding: Finding) {
  return createIntegrationEntity({
    entityData: {
      source: finding,
      assign: {
        _class: Entities.FINDINGS._class,
        _type: Entities.FINDINGS._type,
        _key: getFindingKey(finding.version, finding.testNumber),
        name: `${finding.version}/${finding.testNumber}`,
        displayName: `${finding.version}/${finding.testNumber}`,
        complianceStandardName: 'CIS Kubernetes',
        complianceStandardVersion: finding.version.split('-')[1],
        complianceStandardRequirement: finding.testNumber,
        status: finding.status,
        category: 'benchmark',
        severity: getSeverity(finding),
        numericSeverity: getNumericSeverity(finding),
        open: false,
      },
    },
  });
}
