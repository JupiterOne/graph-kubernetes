import {
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

export type IntegrationStepContext = IntegrationStepExecutionContext<
  IntegrationConfig
>;

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  accessType: {
    type: 'string',
  },
  namespace: {
    type: 'string',
  },
  jupiteroneAccount: {
    type: 'string',
  },
  jupiteroneApiKey: {
    type: 'string',
  },
  integrationId: {
    type: 'string',
  },
  isRunningTest: {
    type: 'boolean',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  accessType: string;
  namespace: string;
  jupiteroneAccount: string;
  jupiteroneApiKey: string;
  integrationId: string;
  isRunningTest: boolean;
}
