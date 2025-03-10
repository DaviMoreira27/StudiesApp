import { getEnv } from './config.types';

export default () => ({
  environment: getEnv(process.env.NODE_ENV),
  port: parseInt(process.env.PORT || '3000', 10),
});
