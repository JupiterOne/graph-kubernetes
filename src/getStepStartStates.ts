import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import {
  AuthorizationClient,
  ResourceType,
  VerbType,
} from './kubernetes/clients/authorization';
import { IntegrationSteps } from './steps/constants';
import { validateInvocation } from './validator';

async function getServiceState(
  resource: ResourceType,
  verb: VerbType,
  client: AuthorizationClient,
) {
  const serviceAccess = await client.fetchSubjectServiceAccess(resource, verb);

  return !serviceAccess.status?.allowed;
}

export default async function getStepStartStates(
  context: IntegrationExecutionContext<IntegrationConfig>,
): Promise<StepStartStates> {
  await validateInvocation(context);
  const { instance, logger } = context;
  const { config } = instance;

  const client = new AuthorizationClient(config);

  try {
    const [
      servicesDisabled,
      deploymentsDisabled,
      replicasetsDisabled,
      statefulsetsDisabled,
      daemonsetsDisabled,
      jobsDisabled,
      cronJobsDisabled,
      configMapsDisabled,
      secretsDisabled,
      podsDisabled,
      nodesDisabled,
    ] = await Promise.all([
      getServiceState('services', 'list', client),
      getServiceState('deployments', 'list', client),
      getServiceState('replicasets', 'list', client),
      getServiceState('statefulsets', 'list', client),
      getServiceState('daemonsets', 'list', client),
      getServiceState('jobs', 'list', client),
      getServiceState('cronjobs', 'list', client),
      getServiceState('configmaps', 'list', client),
      getServiceState('secrets', 'list', client),
      getServiceState('pods', 'list', client),
      getServiceState('nodes', 'list', client),
    ]);

    return {
      [IntegrationSteps.NAMESPACES]: {
        disabled: false,
      },
      [IntegrationSteps.SERVICES]: {
        disabled: servicesDisabled,
      },
      [IntegrationSteps.DEPLOYMENTS]: {
        disabled: deploymentsDisabled,
      },
      [IntegrationSteps.REPLICASETS]: {
        disabled: replicasetsDisabled,
      },
      [IntegrationSteps.STATEFULSETS]: {
        disabled: statefulsetsDisabled,
      },
      [IntegrationSteps.DAEMONSETS]: {
        disabled: daemonsetsDisabled,
      },
      [IntegrationSteps.JOBS]: {
        disabled: jobsDisabled,
      },
      [IntegrationSteps.CRONJOBS]: {
        disabled: cronJobsDisabled,
      },
      [IntegrationSteps.CONFIGMAPS]: {
        disabled: configMapsDisabled,
      },
      [IntegrationSteps.SECRETS]: {
        disabled: secretsDisabled,
      },
      [IntegrationSteps.PODS]: {
        disabled: podsDisabled,
      },
      [IntegrationSteps.NODES]: {
        disabled: nodesDisabled,
      },
    };
  } catch (err) {
    logger.warn({ err }, 'Error checking service enablement');

    throw new IntegrationValidationError(
      `Failed to fetch enabled services. Ability to check which services are enabled is required to run the Kubernetes integration. (error=${err.message})`,
    );
  }
}
