import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { requireEnv } from './env';

const SWAGGER_PATH = 'swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Currency Exchange API')
    .setDescription('The Currency Exchange API documentation')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, document);

  await app.listen(requireEnv('APP_PORT', '3000'));
}

bootstrap();
