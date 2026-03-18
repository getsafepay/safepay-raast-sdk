import { client } from "./generated/client.gen";

export interface RaastSDKConfig {
  apiKey: string; // API key for the API - used to authenticate requests
  baseURL?: string; // Base URL for the API - root URL that all API paths are appended to - can be different for staging/dev/prod
}

export function initClient(config: RaastSDKConfig) {
  // Initializes the client with the config - baseURL and apiKey
  client.setConfig({
    baseURL: config.baseURL || "https://api.getsafepay.com/raastwire",
    auth: config.apiKey,
  });

  client.instance.interceptors.request.use((requestConfig) => {
    requestConfig.headers.set("X-SFPY-AGGREGATOR-SECRET-KEY", config.apiKey);
    return requestConfig;
  });

  return client;
}
