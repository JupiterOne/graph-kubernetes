import { fetchNodes } from '.';
import { createDataCollectionTest } from '../../../test/recording';
import { integrationConfig } from '../../../test/config';
import { Entities } from '../constants';

describe('#fetchNodes', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchNodes',
      recordingDirectory: __dirname,
      integrationConfig,
      stepFunctions: [fetchNodes],
      entitySchemaMatchers: [
        {
          _type: Entities.NODE._type,
          matcher: {
            _class: ['Host'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'kube_node' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
                name: { type: 'string' },
                displayName: { type: 'string' },
                generation: { type: 'number' },
                deletionGracePeriodSeconds: { type: 'string' },
                resourceVersion: { type: 'string' },
                createdOn: { type: 'number' },
                podCIDR: { type: 'string' },
                podCIDRs: {
                  type: 'array',
                  items: { type: 'string' },
                },
                providerID: { type: 'string' },
                unschedulable: { type: 'boolean' },
                'status.allocatable.cpu': { type: 'string' },
                'status.allocatable.ephemeral-storage': { type: 'string' },
                'status.allocatable.hugepages-1Gi': { type: 'string' },
                'status.allocatable.hugepages-2Mi': { type: 'string' },
                'status.allocatable.memory': { type: 'string' },
                'status.allocatable.pods': { type: 'string' },
                'status.capacity.cpu': { type: 'string' },
                'status.capacity.ephemeral-storage': { type: 'string' },
                'status.capacity.hugepages-1Gi': { type: 'string' },
                'status.capacity.hugepages-2Mi': { type: 'string' },
                'status.capacity.memory': { type: 'string' },
                'status.capacity.pods': { type: 'string' },
                'status.kubeletEndpointPort': { type: 'number' },
                'status.nodeInfo.architecture': { type: 'string' },
                'status.nodeInfo.bootID': { type: 'string' },
                'status.nodeInfo.containerRuntimeVersion': { type: 'string' },
                'status.nodeInfo.kernelVersion': { type: 'string' },
                'status.nodeInfo.kubeProxyVersion': { type: 'string' },
                'status.nodeInfo.kubeletVersion': { type: 'string' },
                'status.nodeInfo.machineID': { type: 'string' },
                'status.nodeInfo.operatingSystem': { type: 'string' },
                'status.nodeInfo.osImage': { type: 'string' },
                'status.nodeInfo.systemUUID': { type: 'string' },
              },
            },
          },
        },
      ],
    });
  });
});
