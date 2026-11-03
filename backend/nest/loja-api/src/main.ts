import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // remove propriedades sem decorator no DTO
      forbidNonWhitelisted: true,   // 400 se o client enviar campo desconhecido
      transform: true,              // plain object → instância da classe (+ conversões)
      transformOptions: {
        enableImplicitConversion: true, // "42" (string) → 42 (number) quando o tipo pede
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();