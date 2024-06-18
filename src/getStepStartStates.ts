import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from './config';
import { IntegrationSteps } from './steps/constants';
import { validateInvocation } from './validator';
import getOrCreateAPIClient from './kubernetes/getOrCreateAPIClient';
import {
  ApiGroupType,
  Client,
  ResourceType,
  VerbType,
} from './kubernetes/client';

async function getServiceState(
  group: ApiGroupType,
  resource: ResourceType,
  verb: VerbType,
  client: Client,
) {
  const serviceAccess = await client.fetchSubjectServiceAccess(
    group,
    resource,
    verb,
  );

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
      getServiceState('core', 'services', 'list', client),
      getServiceState('apps', 'deployments', 'list', client),
      getServiceState('apps', 'replicasets', 'list', client),
      getServiceState('apps', 'statefulsets', 'list', client),
      getServiceState('apps', 'daemonsets', 'list', client),
      getServiceState('batch', 'jobs', 'list', client),
      getServiceState('batch', 'cronjobs', 'list', client),
      getServiceState('core', 'configmaps', 'list', client),
      getServiceState('core', 'secrets', 'list', client),
      getServiceState('core', 'nodes', 'list', client),
    ]);

    return {
      [IntegrationSteps.NETWORK_POLICIES]: {
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
      [IntegrationSteps.IMAGES]: {
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
      [IntegrationSteps.CONTAINER_SPEC_HAS_JOB]: {
        disabled: jobsDisabled,
      },
      [IntegrationSteps.CONTAINER_SPEC_HAS_DAEMONSET]: {
        disabled: daemonsetsDisabled,
      },
      [IntegrationSteps.CONTAINER_SPEC_HAS_REPLICASET]: {
        disabled: replicasetsDisabled,
      },
      [IntegrationSteps.CONTAINER_SPEC_HAS_STATEFULSET]: {
        disabled: statefulsetsDisabled,
      },
      [IntegrationSteps.CONTAINER_SPEC_HAS_CRON_JOB]: {
        disabled: cronJobsDisabled,
      },
      [IntegrationSteps.PODS]: {
        disabled: !(
          instance.accountId == '0c51143d-9728-4f42-8442-4b52be5e8a74' ||
          instance.accountId == 'j1dev'
        ), // INT-10704
      },
    };
  } catch (err) {
    logger.warn({ err }, 'Error checking service enablement');

    throw new IntegrationValidationError(
      `Failed to fetch enabled services. Ability to check which services are enabled is required to run the Kubernetes integration. (error=${err.message})`,
    );
  }
}
