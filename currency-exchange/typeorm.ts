import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm/data-source/DataSource';

config(); // Load environment variables from .env file
const configService = new ConfigService();

const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isDevelopment
    ? 'localhost'
    : configService.get<string>('POSTGRES_HOST'),
  port: parseInt(configService.get<string>('POSTGRES_PORT')),
  username: configService.get<string>('POSTGRES_USERNAME'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DATABASE'),
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
