import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { requireEnv } from 'src/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: requireEnv('POSTGRES_HOST'),
      port: parseInt(requireEnv('POSTGRES_PORT')),
      username: requireEnv('POSTGRES_USERNAME'),
      password: requireEnv('POSTGRES_PASSWORD'),
      database: requireEnv('POSTGRES_DATABASE'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
