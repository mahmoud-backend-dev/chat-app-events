import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication, Logger } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { SocketAuthMiddleware } from './middlewares/socket-auth.middleware';

export class SocketIOAdapter extends IoAdapter {
  constructor(
    private app: INestApplication,
    private readonly authMiddleware: SocketAuthMiddleware,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.use(this.authMiddleware.use.bind(this.authMiddleware));
    return server;
  }
}
