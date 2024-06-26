import {
  IntegrationStep,
  RelationshipClass,
  createDirectRelationship,
  getRawData,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import * as k8s from '@kubernetes/client-node';
import { createContainerImageEntity } from './converters';

export async function fetchImages(
  context: IntegrationStepContext,
): Promise<void> {
  const { jobState, logger } = context;

  await jobState.iterateEntities(
    {
      _type: Entities.NODE._type,
    },
    async (nodeEntity) => {
      const rawNode = getRawData<k8s.V1Node>(nodeEntity);
      if (rawNode?.status?.images) {
        for (const image of rawNode!.status!.images) {
          try {
            const imageEntity = createContainerImageEntity(image);
            if (!jobState.hasKey(imageEntity._key)) {
              await jobState.addEntity(imageEntity);
              await jobState.addRelationship(
                createDirectRelationship({
                  from: nodeEntity,
                  to: imageEntity,
                  _class: RelationshipClass.HAS,
                }),
              );
            } else {
              logger.info(
                { imageKey: imageEntity._key },
                'Image already exists',
              );
            }
          } catch (error) {
            logger.info(
              { error },
              'Could not create image entity or relationships',
            );
          }
        }
      }
    },
  );
}

export const imageSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.IMAGES,
    name: 'Fetch Images',
    entities: [Entities.IMAGE],
    relationships: [Relationships.NODE_HAS_IMAGE],
    dependsOn: [IntegrationSteps.NODES],
    executionHandler: fetchImages,
  },
];
