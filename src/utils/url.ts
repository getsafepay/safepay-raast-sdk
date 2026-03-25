import { Environment, type EnvironmentInput } from "../types/environment";

export const BASE_URLS_BY_ENVIRONMENT: Record<Environment, string> = {
  [Environment.Production]: "https://api.getsafepay.com/raastwire",
};

const ENVIRONMENT_ALIASES: Record<string, Environment> = {
  [Environment.Production]: Environment.Production,
  prod: Environment.Production,
};

export function getEnvironment(environment?: EnvironmentInput): Environment {
  if (
    environment === false ||
    environment === null ||
    environment === undefined
  ) {
    return Environment.Production;
  }

  const normalizedEnvironment =
    typeof environment === "string"
      ? environment.trim().toLowerCase()
      : environment;

  if (!normalizedEnvironment) {
    return Environment.Production;
  }

  return ENVIRONMENT_ALIASES[normalizedEnvironment] ?? Environment.Production;
}

export function getBaseUrl(environment?: EnvironmentInput): string {
  return BASE_URLS_BY_ENVIRONMENT[getEnvironment(environment)];
}
