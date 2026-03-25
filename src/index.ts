export { initClient } from "./client"; // Default use: initClient once at backend startup, then call endpoint functions.
export type { RaastSDKConfig } from "./client";
export { Environment } from "./types/environment";
export type { EnvironmentInput } from "./types/environment";
export { BASE_URLS_BY_ENVIRONMENT, getBaseUrl, getEnvironment } from "./utils/url";

export { client } from "./generated/client.gen"; // exporting for advanced control (custom interceptors, custom axios instance, dynamic per-request config, etc.).
export * from "./generated/sdk.gen";
export * from "./generated/types.gen";
