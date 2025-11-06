import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for better-auth to handle multipart requests
  });

  await app.listen(process.env.PORT ?? 3000); // Use PORT from environment or default to 3000
}
bootstrap();
