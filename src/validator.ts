import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { CoreClient } from './kubernetes/clients/core';

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  if (
    !config.accessType ||
    !config.namespace ||
    !config.jupiteroneAccount ||
    !config.jupiteroneApiKey ||
    !config.integrationId ||
    // isRunningTest is a boolean
    config.isRunningTest == null
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {accessType, namespace, jupiteroneAccount, jupiteroneApiKey, integrationId}',
    );
  }

  const coreClient = new CoreClient(config);
  await coreClient.verifyAuthentication();
}
