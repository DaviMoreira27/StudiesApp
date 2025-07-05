import { GoogleBuckets, NodeEnvironments } from './config.types';

export default () => ({
  // SERVER
  environment: getEnv(process.env.NODE_ENV),
  port: parseInt(process.env.PORT || '3000', 10),
  
  // WHATSAPP
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? 'APPLE',
  whatsappAccessToken: process.env.WHATSSAP_ACCESS_TOKEN ?? 'BANANA',
  
  // GOOGLE
  googleBucket: getBucket(getEnv(process.env.NODE_ENV)),
  googleAccountCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '',

  // DATABASE
  databaseHost: process.env.DATABASE_HOST || 'localhost',
  databasePort: parseInt(process.env.DATABASE_PORT || '3306', 10),
  databaseUser: process.env.DATABASE_USERNAME || 'root',
  databasePassword: process.env.DATABASE_PASSWORD || 'root',
  databaseName: process.env.DATABASE_NAME || 'test',
  databaseSync: process.env.DATABASE_SYNCHRONIZE === 'true',
  databaseLogging: process.env.DATABASE_LOGGING === 'true',
});

function getEnv(environment?: string) {
  return Object.values(NodeEnvironments).includes(environment as NodeEnvironments)
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
