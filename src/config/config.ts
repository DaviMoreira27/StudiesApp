import { getEnv } from './config.types';

export default () => ({
  environment: getEnv(process.env.NODE_ENV),
  port: parseInt(process.env.PORT || '3000', 10),
  WHATSAPP_VERIFY_TOKEN: process.env.MY_TOKEN ?? 'APPLE',
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSSAP_ACCESS_TOKEN ?? 'BANANA',
});
