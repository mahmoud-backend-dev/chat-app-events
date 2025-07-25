import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SocketIOAdapter } from './common/socket-adapter';
import { SocketAuthMiddleware } from './common/middlewares/socket-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const authMiddleware = app.get(SocketAuthMiddleware);
  app.useWebSocketAdapter(new SocketIOAdapter(app, authMiddleware));

  await app.listen(3000);
}
bootstrap();
