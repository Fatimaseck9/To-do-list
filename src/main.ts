import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); 
 
    // Activer CORS
    app.enableCors(); // Cela autorisera tout le monde à accéder à votre API
  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
