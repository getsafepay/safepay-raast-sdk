import { client } from "./generated/client.gen";
import type { EnvironmentInput } from "./types/environment";
import { getBaseUrl, getEnvironment } from "./utils/url";

export interface RaastSDKConfig {
  apiKey: string; // API key for the API - used to authenticate requests
  environment?: EnvironmentInput; // Runtime environment used to resolve the base URL for API requests
}

export function initClient(config: RaastSDKConfig) {
  const environment = getEnvironment(config.environment);

  // Initializes the client with the config - environment-derived base URL and apiKey
  client.setConfig({
    baseURL: getBaseUrl(environment),
    auth: config.apiKey,
  });

  client.instance.interceptors.request.use((requestConfig) => {
    requestConfig.headers.set("X-SFPY-AGGREGATOR-SECRET-KEY", config.apiKey);
    return requestConfig;
  });

  return client;
}
