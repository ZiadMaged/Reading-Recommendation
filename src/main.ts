import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.enableCors({
    exposedHeaders: ['*'],
  });

  const config = new DocumentBuilder()
    .setTitle('Reading Recommendation System APIs')
    .setDescription('Description for Reading Recommendation System APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync(
    path.join(__dirname, '..', 'dist', 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('', app, document);
  const server = await app.listen(process.env.PORT || 3000);
  server.setTimeout(3600000); // 1 hour
}

bootstrap().then(() => {
  console.log(`Server started at port ${process.env.PORT || 3000}`);
});
