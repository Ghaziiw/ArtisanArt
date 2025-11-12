import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for better-auth to handle multipart requests
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Delete attributes not in the DTO
      forbidNonWhitelisted: true, // Error if non-whitelisted field sent
      transform: true, // Automatically converts types (e.g., string → number)
    }),
  );

  // Enable Class Serializer Interceptor globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000); // Use PORT from environment or default to 3000
}
void bootstrap();
