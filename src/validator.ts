import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import getOrCreateAPIClient from './kubernetes/getOrCreateAPIClient';

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  if (
    !config.accessType ||
    !config.namespace ||
    !config.jupiteroneAccountId ||
    !config.jupiteroneApiKey ||
    !config.integrationInstanceId
    // This has a default value.
    // typeof config.loadKubernetesConfigFromDefault !== 'boolean'
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {accessType, namespace, jupiteroneAccountId, jupiteroneApiKey, integrationInstanceId}',
    );
  }

  const client = getOrCreateAPIClient(config);
  await client.verifyAuthentication();
}
