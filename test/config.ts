import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (Boolean(process.env.LOAD_ENV) === true) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

function shouldLoadKubernetesConfigFromDefault() {
  const loadKubernetesConfigFromDefault =
    process.env.LOAD_KUBERNETES_CONFIG_FROM_DEFAULT;
  return loadKubernetesConfigFromDefault
    ? Boolean(loadKubernetesConfigFromDefault) === true
    : true;
}

export const integrationConfig: IntegrationConfig = {
  loadKubernetesConfigFromDefault: shouldLoadKubernetesConfigFromDefault(),
  accessType: process.env.ACCESS_TYPE || 'test-access-type',
  namespace: process.env.NAMESPACE || 'test-access-type',
  jupiteroneAccountId:
    process.env.JUPITERONE_ACCOUNT_ID || 'test-jupiterone-account',
  jupiteroneApiKey: process.env.JUPITERONE_API_KEY || 'test-jupiterone-api-key',
  integrationInstanceId:
    process.env.INTEGRATION_INSTANCE_ID || 'test-integration-id',
};
