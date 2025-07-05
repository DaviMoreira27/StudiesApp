import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createTypeOrmOptions = (config: ConfigService): DataSourceOptions => ({
  type: 'postgres',
  host: config.get<string>('databaseHost'),
  port: config.get<number>('databasePort') ?? 5432,
  username: config.get<string>('databaseUser'),
  password: config.get<string>('databasePassword'),
  database: config.get<string>('databaseName'),
  synchronize: config.get<boolean>('databaseSync'),
  logging: config.get<boolean>('databaseLogging'),
  migrationsRun: true,
  entities: ['dist/database/entities/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
});
