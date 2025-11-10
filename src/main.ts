import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './guards/api-key.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Swagger setup (conditional)
  if (process.env.SWAGGER_ENABLED === 'true') {
    const config = new DocumentBuilder()
      .setTitle('GeoAPI')
      .setDescription('RESTful API for country and city information')
      .setVersion('1.0')
      .addApiKey({
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key needed to access the endpoints',
      }, 'api-key')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
