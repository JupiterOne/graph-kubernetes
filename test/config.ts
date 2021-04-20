import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export const integrationConfig: IntegrationConfig = {
  isRunningTest: ((process.env.IS_RUNNING_TEST as unknown) as boolean) || true,
  accessType: process.env.ACCESS_TYPE || 'test-access-type',
  namespace: process.env.NAMESPACE || 'test-access-type',
  jupiteroneAccount:
    process.env.JUPITERONE_ACCOUNT || 'test-jupiterone-account',
  jupiteroneApiKey: process.env.JUPITERONE_API_KEY || 'test-jupiterone-api-key',
  integrationId: process.env.INTEGRATION_ID || 'test-integration-id',
};
