import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { IntegrationSteps } from './steps/constants';
import { validateInvocation } from './validator';
import getOrCreateAPIClient from './kubernetes/getOrCreateAPIClient';
import { Client, ResourceType, VerbType } from './kubernetes/client';

async function getServiceState(
  resource: ResourceType,
  verb: VerbType,
  client: Client,
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

  const client = getOrCreateAPIClient(config);

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
      getServiceState('nodes', 'list', client),
    ]);

    return {
      [IntegrationSteps.NETWORK_POLICIES]: {
        disabled: false,
      },
      [IntegrationSteps.POD_SECURITY_POLICIES]: {
        disabled: false,
      },
      [IntegrationSteps.SERVICE_ACCOUNTS]: {
        disabled: false,
      },
      [IntegrationSteps.USERS]: {
        disabled: false,
      },
      [IntegrationSteps.ROLES]: {
        disabled: false,
      },
      [IntegrationSteps.CLUSTER_ROLES]: {
        disabled: false,
      },
      [IntegrationSteps.ROLE_BINDINGS]: {
        disabled: false,
      },
      [IntegrationSteps.CLUSTER_ROLE_BINDINGS]: {
        disabled: false,
      },
      [IntegrationSteps.CLUSTERS]: {
        disabled: false,
      },
      [IntegrationSteps.BUILD_CLUSTER_RESOURCES_RELATIONSHIPS]: {
        disabled: false,
      },
      [IntegrationSteps.BUILD_CLUSTER_AKS_RELATIONSHIPS]: {
        disabled: false,
      },
      [IntegrationSteps.BUILD_CLUSTER_GKE_RELATIONSHIPS]: {
        disabled: false,
      },
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
