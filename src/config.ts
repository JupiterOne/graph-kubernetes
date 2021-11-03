import {
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

export type IntegrationStepContext = IntegrationStepExecutionContext<IntegrationConfig>;

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessType: {
    type: 'string',
  },
  namespace: {
    type: 'string',
  },
  jupiteroneAccountId: {
    type: 'string',
  },
  jupiteroneApiKey: {
    type: 'string',
  },
  integrationInstanceId: {
    type: 'string',
  },
  /**
   * Whether or not we should load the default Kubernetes config, which is
   * assigned via the `KUBECONFIG` environment variable
   */
  loadKubernetesConfigFromDefault: {
    type: 'boolean',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  accessType: string;
  namespace: string;
  jupiteroneAccountId: string;
  jupiteroneApiKey: string;
  integrationInstanceId: string;
  loadKubernetesConfigFromDefault: boolean;
}
