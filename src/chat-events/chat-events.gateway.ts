import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from '../message/dto/create-message.dto';
import { MessageService } from '../message/message.service';

type RoomUserMap = Record<string, Set<string>>;
const messageRateLimitMap = new Map<string, number[]>();

function isRateLimited(userId: string, roomId: string): boolean {
  const now = Date.now();
  const key = `${userId}:${roomId}`;
  const window = 10_000;
  const limit = 5;

  const timestamps = messageRateLimitMap.get(key) || [];
  const recent = timestamps.filter(ts => now - ts < window);
  if (recent.length >= limit) return true;

  recent.push(now);
  messageRateLimitMap.set(key, recent);
  return false;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;
  private roomUsers: RoomUserMap = {};
  private readonly logger = new Logger(ChatEventsGateway.name);

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [room, users] of Object.entries(this.roomUsers)) {
      users.delete(client.id);
      this.server.to(room).emit('roomUsers', Array.from(users));
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId } = data;

    client.join(roomId);
    if (!this.roomUsers[roomId]) {
      this.roomUsers[roomId] = new Set();
    }
    this.roomUsers[roomId].add(client.id);

    const lastMessages = await this.messageService.getRecentMessages(roomId);
    client.emit('lastMessages', lastMessages.reverse());

    this.server
      .to(roomId)
      .emit('roomUsers', Array.from(this.roomUsers[roomId]));
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() body: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await validateOrReject(Object.assign(new SendMessageDto(), body));
    } catch (err) {
      client.emit('validationError', err);
      return;
    }

    if (isRateLimited(body.senderId, body.roomId)) {
      client.emit('rateLimited', {
        message: 'Too many messages. Try again later.',
      });
      return;
    }

    const saved = await this.messageService.createMessage(body);

    if (body.receiverId) {
      // DM to one
      client.emit(`dm:${body.receiverId}`, saved);
    } else {
      // Public message to room
      this.server.to(body.roomId).emit('newMessage', saved);
    }
  }

  @SubscribeMessage('loadMoreMessages')
  async handleLoadMoreMessages(
    @MessageBody() data: { roomId: string; before: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.messageService.getMessagesBefore(
      data.roomId,
      new Date(data.before),
      20,
    );

    client.emit('moreMessages', messages.reverse());
  }
}
