import { IntegrationStepExecutionContext } from '@jupiterone/integration-sdk-core';
import {
  setupRecording,
  SetupRecordingInput,
  createMockStepExecutionContext,
  ToMatchGraphObjectSchemaParams,
  ToMatchRelationshipSchemaParams,
} from '@jupiterone/integration-sdk-testing';
import { PollyConfig } from '@pollyjs/core';
import * as nodeUrl from 'url';

export { Recording } from '@jupiterone/integration-sdk-testing';

const DEFAULT_RECORDING_HOST = '192.168.49.2:8443';
const DEFAULT_RECORDING_BASE_URL = `https://${DEFAULT_RECORDING_HOST}`;

interface PollyRequestHeader {
  name: string;
  value: string;
}

function redact(entry: any) {
  let responseText = entry.response.content.text;
  if (!responseText) {
    return;
  }

  responseText = responseText.replace(/\r?\n|\r/g, '');

  const fieldsToRedact = [
    'api_key',
    'jupiteroneAccountId',
    'jupiteroneApiKey',
    'jupiteroneIntegrationInstanceId',
  ];

  const base64Regex =
    '((?:[a-zA-Z0-9+/]{4})*(?:|(?:[a-zA-Z0-9+/]{3}=)|(?:[a-zA-Z0-9+/]{2}==)|(?:[a-zA-Z0-9+/]{1}===)))';
  for (const field of fieldsToRedact) {
    const innerFieldRegex = new RegExp(
      `\\\\"${field}\\\\":\\\\"${base64Regex}\\\\"`,
      'g',
    );
    const fieldRegex = new RegExp(`"${field}":"${base64Regex}"`, 'g');
    responseText = responseText.replace(
      innerFieldRegex,
      `\\"${field}\\":\\"[REDACTED]\\"`,
    );
    responseText = responseText.replace(fieldRegex, `"${field}":"[REDACTED]"`);
  }

  const parsedResponseText = JSON.parse(responseText);
  entry.response.content.text = parsedResponseText;
}

function getNormalizedRecordingUrl(url: string) {
  const parsedUrl = nodeUrl.parse(url);
  return `${DEFAULT_RECORDING_BASE_URL}${parsedUrl.path}`;
}

function normalizeRequestEntryHeaders(oldRequestHeaders: PollyRequestHeader[]) {
  const newRequestHeaders: PollyRequestHeader[] = [];

  for (const oldRequestHeader of oldRequestHeaders) {
    if (oldRequestHeader.name === 'host') {
      newRequestHeaders.push({
        ...oldRequestHeader,
        value: DEFAULT_RECORDING_HOST,
      });
    } else {
      newRequestHeaders.push(oldRequestHeader);
    }
  }

  return newRequestHeaders;
}

function normalizeRequestEntry(entry: any) {
  entry.request.url = getNormalizedRecordingUrl(entry.request.url);
  entry.request.headers = normalizeRequestEntryHeaders(
    entry.request.headers || [],
  );
}

function isRecordingEnabled() {
  return Boolean(process.env.LOAD_ENV) === true;
}

export async function withRecording(
  recordingName: string,
  directoryName: string,
  cb: () => Promise<void>,
  options?: SetupRecordingInput['options'],
) {
  const recordingEnabled = isRecordingEnabled();

  const recording = setupRecording({
    directory: directoryName,
    name: recordingName,
    mutateEntry(entry) {
      redact(entry);
      normalizeRequestEntry(entry);
    },
    options: {
      mode: recordingEnabled ? 'record' : 'replay',
      recordIfMissing: recordingEnabled,
      recordFailedRequests: false,
      // https://github.com/Netflix/pollyjs/blob/cbca602a5a446da46a4a2834f893670b8c577880/docs/configuration.md#matchrequestsby
      matchRequestsBy: {
        headers: false,
        body: false,
        method: true,
        order: true,
        url(url, req) {
          return getNormalizedRecordingUrl(url);
        },
      },
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
  options?: PollyConfig;
}

export async function createDataCollectionTest<IIntegrationConfig>({
  recordingName,
  recordingDirectory,
  integrationConfig,
  stepFunctions,
  entitySchemaMatchers,
  relationshipSchemaMatchers,
  options,
}: CreateDataCollectionTestParams<IIntegrationConfig>) {
  const context = createMockStepExecutionContext<IIntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  await withRecording(
    recordingName,
    recordingDirectory,
    async () => {
      for (const stepFunction of stepFunctions) {
        await stepFunction(context);
      }

      expect({
        numCollectedEntities: context.jobState.collectedEntities.length,
        numCollectedRelationships:
          context.jobState.collectedRelationships.length,
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
    },
    { ...options },
  );

  return { context };
}
