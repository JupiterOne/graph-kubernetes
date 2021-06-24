import { JobState } from '@jupiterone/integration-sdk-core';
import * as k8s from '@kubernetes/client-node';

function getNodeCacheKeyFromPod(pod: k8s.V1Pod) {
  return `node:${pod.spec?.nodeName}`;
}

export async function cacheNodeNameToUid(jobState: JobState, node: k8s.V1Node) {
  await jobState.setData(`node:${node.metadata?.name}`, node.metadata?.uid);
}

export async function getNodeUidFromPod(jobState: JobState, pod: k8s.V1Pod) {
  return jobState.getData<string>(getNodeCacheKeyFromPod(pod));
}
