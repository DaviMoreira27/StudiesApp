export enum NodeEnvironments {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export function getEnv(environment?: string) {
  return Object.values(NodeEnvironments).includes(
    environment as NodeEnvironments,
  )
    ? (environment as NodeEnvironments)
    : NodeEnvironments.PRODUCTION;
}
