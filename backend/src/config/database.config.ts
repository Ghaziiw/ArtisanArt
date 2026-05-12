import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DATABASE_URL =
  `postgres://${process.env.DB_USERNAME}` +
  `:${process.env.DB_PASSWORD}` +
  `@${process.env.DB_HOST}` +
  `:${process.env.DB_PORT}` +
  `/${process.env.DB_DATABASE}`;

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '2426',
  database: process.env.DB_DATABASE || 'artisanart',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development', // Disable in production
  logging: process.env.NODE_ENV === 'development', // Enable logging in development
};
