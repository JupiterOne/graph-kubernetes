import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';

export type Permission = {
  apiGroups: string[];
  resources: string[];
  verbs: string[];
};

export interface KubernetesIntegrationStep
  extends IntegrationStep<IntegrationConfig> {
  permissions?: Permission[];
}
