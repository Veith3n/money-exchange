import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { requireEnv } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(requireEnv('APP_PORT', '3000'));
}

bootstrap();
