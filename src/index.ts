import { IntegrationConfig, instanceConfigFields } from './config';
import { validateInvocation } from './validator';
import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { clustersSteps } from './steps/clusters';
import { namespaceSteps } from './steps/namespaces';
import { nodeSteps } from './steps/nodes';
import { serviceSteps } from './steps/services';
import { deploymentsSteps } from './steps/deployments';
import { replicaSetsSteps } from './steps/replica-sets';
import { statefulSetsSteps } from './steps/stateful-sets';
import { daemonSetsSteps } from './steps/daemon-sets';
import { jobsSteps } from './steps/jobs';
import { cronJobsSteps } from './steps/cron-jobs';
import { configMapsSteps } from './steps/config-maps';
import { secretsSteps } from './steps/secrets';

import getStepStartStates from './getStepStartStates';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  getStepStartStates,
  integrationSteps: [
    ...clustersSteps,
    ...namespaceSteps,
    ...nodeSteps,
    ...serviceSteps,
    ...deploymentsSteps,
    ...replicaSetsSteps,
    ...statefulSetsSteps,
    ...daemonSetsSteps,
    ...jobsSteps,
    ...cronJobsSteps,
    ...configMapsSteps,
    ...secretsSteps,
  ],
};
