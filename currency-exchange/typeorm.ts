import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm/data-source/DataSource';

config(); // Load environment variables from .env file
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // host: configService.get<string>('POSTGRES_HOST'),
  host: 'localhost', // left for development purposes
  port: parseInt(configService.get<string>('POSTGRES_PORT')),
  username: configService.get<string>('POSTGRES_USERNAME'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/models/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
