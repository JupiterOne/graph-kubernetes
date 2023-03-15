/* eslint-disable no-console */
import { promises as fs } from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { invocationConfig } from '../src';
import { KubernetesIntegrationStep } from '../src/types';

const table = require('markdown-table');
const chalk = require('chalk');

export type DocumentationPermission = {
  apiGroups: Set<string>;
  resources: Set<string>;
  verbs: string[];
};

const documentPermissionsCommand = new Command();

interface DocumentCommandArgs {
  outputFile: string;
}

const J1_PERMISSIONS_DOCUMENTATION_MARKER_START =
  '<!-- {J1_PERMISSIONS_DOCUMENTATION_MARKER_START} -->';
const J1_PERMISSIONS_DOCUMENTATION_MARKER_END =
  '<!-- {J1_PERMISSIONS_DOCUMENTATION_MARKER_END} -->';

documentPermissionsCommand
  .command('documentPermissions')
  .description('Generate GCP permissions list')
  .option(
    '-o, --output-file <path>',
    'project relative path to generated Markdown file',
    path.join('docs', 'jupiterone.md'),
  )
  .action(executeDocumentPermissionsAction);

documentPermissionsCommand.parse();

async function executeDocumentPermissionsAction(options: DocumentCommandArgs) {
  const { outputFile } = options;

  console.log(
    chalk.gray(
      'DOCUMENT PERMISSIONS (START): Collecting permissions from steps...',
    ),
  );

  const documentationFilePath = path.join(process.cwd(), outputFile);
  const oldDocumentationFile = await getDocumentationFile(
    documentationFilePath,
  );

  if (!oldDocumentationFile) {
    return;
  }

  const newGeneratedDocumentationSection = getNewDocumentationVersion();

  console.log(chalk.gray(newGeneratedDocumentationSection));

  if (!newGeneratedDocumentationSection) return;

  const newDocumentationFile = replaceBetweenDocumentMarkers(
    oldDocumentationFile,
    newGeneratedDocumentationSection,
  );

  try {
    await fs.writeFile(documentationFilePath, newDocumentationFile, {
      encoding: 'utf-8',
    });
  } catch (error) {
    console.log(
      chalk.gray(
        `Unable to write documentation file from path ${documentationFilePath}.`,
      ),
    );
  }

  console.log(
    chalk.gray(
      `DOCUMENT PERMISSIONS (END): Finished document permissions process.`,
    ),
  );
}

function getDocumentationFile(documentationFilePath: string) {
  try {
    chalk.gray(`Reading documentation file from ${documentationFilePath}`);
    return fs.readFile(documentationFilePath, {
      encoding: 'utf-8',
    });
  } catch (error) {
    console.log(
      chalk.gray(
        `Unable to read documentation file from path ${documentationFilePath}. Aborting`,
      ),
    );
  }
}

function getNewDocumentationVersion(): string | undefined {
  const LIST_RESOURCES_VERB = 'list';
  // const GET_RESOURCES_VERB = 'get';

  const { integrationSteps } = invocationConfig;

  const permissionsList: DocumentationPermission[] = [
    {
      apiGroups: new Set<string>(),
      resources: new Set<string>(),
      verbs: [LIST_RESOURCES_VERB],
    },
  ];

  integrationSteps.map((integrationStep) => {
    const kubernetesIntegrationStep = integrationStep as KubernetesIntegrationStep;
    if (kubernetesIntegrationStep.permissions) {
      kubernetesIntegrationStep.permissions.map((permission) => {
        if (
          permission.verbs.length === 1 &&
          permission.verbs[0] === LIST_RESOURCES_VERB
        ) {
          permission.apiGroups.map((apiGroup) =>
            permissionsList[0].apiGroups.add(apiGroup),
          );
          permission.resources.map((resource) =>
            permissionsList[0].resources.add(resource),
          );
        } else {
          permissionsList.push({
            apiGroups: new Set<string>(permission.apiGroups),
            resources: new Set<string>(permission.resources),
            verbs: permission.verbs,
          });
        }
      });
    }
  });

  const tableMarkdown = getTableMarkdown(permissionsList);

  return `${J1_PERMISSIONS_DOCUMENTATION_MARKER_START}\n${tableMarkdown}\n${J1_PERMISSIONS_DOCUMENTATION_MARKER_END}`;
}

function getTableMarkdown(permissionsList: DocumentationPermission[]): string {
  return table([
    ['apiGroups', 'resources', 'verbs'],
    ...permissionsList.map((permission) => [
      `[${Array.from(permission.apiGroups)
        .sort((a, b) => a.localeCompare(b))
        .map((apiGroup) => `"${apiGroup}"`)}]`,
      `[${Array.from(permission.resources)
        .sort((a, b) => a.localeCompare(b))
        .map((resource) => `"${resource}"`)}]`,
      `[${Array.from(permission.verbs)
        .sort((a, b) => a.localeCompare(b))
        .map((verb) => `"${verb}"`)}]`,
    ]),
  ]);
}

function replaceBetweenDocumentMarkers(
  oldDocumentationFile: string,
  newGeneratedDocumentationSection: string,
): string {
  const startIndex = oldDocumentationFile.indexOf(
    J1_PERMISSIONS_DOCUMENTATION_MARKER_START,
  );

  if (startIndex === -1) {
    return `${oldDocumentationFile}\n\n${newGeneratedDocumentationSection}`;
  }

  const endIndex = oldDocumentationFile.indexOf(
    J1_PERMISSIONS_DOCUMENTATION_MARKER_END,
  );

  return (
    oldDocumentationFile.substring(0, startIndex) +
    newGeneratedDocumentationSection +
    oldDocumentationFile.substring(
      endIndex + J1_PERMISSIONS_DOCUMENTATION_MARKER_END.length,
    )
  );
}
