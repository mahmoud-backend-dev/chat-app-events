import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketAuthMiddleware {
  use(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth?.token;

    if (!token || token !== 'dummy-jwt') {
      return next(new Error('Unauthorized: Invalid or missing token'));
    }

    // Inject fake user info for use inside the socket connection
    socket.data.user = {
      id: '1',
      name: 'John Doe',
    };

    return next();
  }
}
