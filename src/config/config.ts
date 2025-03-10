import { GoogleBuckets, NodeEnvironments } from './config.types';

export default () => ({
  environment: getEnv(process.env.NODE_ENV),
  port: parseInt(process.env.PORT || '3000', 10),
  googleBucket: getBucket(getEnv(process.env.NODE_ENV)),
});

function getEnv(environment?: string) {
  return Object.values(NodeEnvironments).includes(
    environment as NodeEnvironments,
  )
    ? (environment as NodeEnvironments)
    : NodeEnvironments.DEVELOPMENT;
}

function getBucket(environment: NodeEnvironments) {
  switch (environment) {
    case NodeEnvironments.DEVELOPMENT:
      return GoogleBuckets.DEVELOPMENT_BUCKET;
    case NodeEnvironments.STAGING:
      return GoogleBuckets.STAGING_BUCKET;
    case NodeEnvironments.PRODUCTION:
      return GoogleBuckets.PRODUCTION_BUCKET;
    default:
      return GoogleBuckets.DEVELOPMENT_BUCKET;
  }
}
