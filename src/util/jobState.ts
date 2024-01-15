import { JobState } from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';

export async function cacheNodeNameToUid(jobState: JobState, node: k8s.V1Node) {
  await jobState.setData(`node:${node.metadata?.name}`, node.metadata?.uid);
}
