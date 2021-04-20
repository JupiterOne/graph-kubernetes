import { IntegrationStepExecutionContext } from '@jupiterone/integration-sdk-core';
import {
  setupRecording,
  SetupRecordingInput,
  createMockStepExecutionContext,
  ToMatchGraphObjectSchemaParams,
  ToMatchRelationshipSchemaParams,
} from '@jupiterone/integration-sdk-testing';

export { Recording } from '@jupiterone/integration-sdk-testing';

function redact(entry: any) {
  const responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  const parsedResponseText = JSON.parse(responseText.replace(/\r?\n|\r/g, ''));

  entry.response.content.text = JSON.stringify(parsedResponseText);
}

export async function withRecording(
  recordingName: string,
  directoryName: string,
  cb: () => Promise<void>,
  options?: SetupRecordingInput['options'],
) {
  const recording = setupRecording({
    directory: directoryName,
    name: recordingName,
    mutateEntry(entry) {
      redact(entry);
    },
    options: {
      recordFailedRequests: false,
      ...(options || {}),
    },
  });

  try {
    await cb();
  } finally {
    await recording.stop();
  }
}

export interface EntitySchemaMatcher {
  _type: string;
  matcher: ToMatchGraphObjectSchemaParams;
}

export interface RelationshipSchemaMatcher {
  _type: string;
  matcher: ToMatchRelationshipSchemaParams;
}

export interface CreateDataCollectionTestParams<IIntegrationConfig> {
  recordingName: string;
  recordingDirectory: string;
  integrationConfig: IIntegrationConfig;
  stepFunctions: ((
    context: IntegrationStepExecutionContext<IIntegrationConfig>,
  ) => Promise<void>)[];
  entitySchemaMatchers?: EntitySchemaMatcher[];
  relationshipSchemaMatchers?: RelationshipSchemaMatcher[];
}

export async function createDataCollectionTest<IIntegrationConfig>({
  recordingName,
  recordingDirectory,
  integrationConfig,
  stepFunctions,
  entitySchemaMatchers,
  relationshipSchemaMatchers,
}: CreateDataCollectionTestParams<IIntegrationConfig>) {
  const context = createMockStepExecutionContext<IIntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  await withRecording(recordingName, recordingDirectory, async () => {
    for (const stepFunction of stepFunctions) {
      await stepFunction(context);
    }

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot('jobState');

    if (entitySchemaMatchers) {
      for (const entitySchemaMatcher of entitySchemaMatchers) {
        expect(
          context.jobState.collectedEntities.filter(
            (e) => e._type === entitySchemaMatcher._type,
          ),
        ).toMatchGraphObjectSchema(entitySchemaMatcher.matcher);
      }
    }

    if (relationshipSchemaMatchers) {
      for (const relationshipSchemaMatcher of relationshipSchemaMatchers) {
        expect(
          context.jobState.collectedRelationships.filter(
            (r) => r._type === relationshipSchemaMatcher._type,
          ),
        ).toMatchDirectRelationshipSchema(relationshipSchemaMatcher.matcher);
      }
    }
  });

  return { context };
}
