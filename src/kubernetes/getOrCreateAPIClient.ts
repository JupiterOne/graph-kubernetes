import { IntegrationConfig } from '../config';
import { Client } from './client';

let client: Client | undefined;

export default function getOrCreateAPIClient(
  config: IntegrationConfig,
): Client {
  if (!client) {
    client = new Client(config);
  }
  return client;
}
