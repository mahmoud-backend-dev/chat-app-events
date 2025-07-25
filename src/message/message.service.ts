import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schema/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(data: {
    roomId: string;
    senderId: string;
    receiverId?: string;
    content: string;
  }) {
    return this.messageModel.create(data);
  }

  async getRecentMessages(roomId: string, limit = 20) {
    return this.messageModel
      .find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getMessagesBefore(roomId: string, before: Date, limit = 20) {
    return this.messageModel
      .find({ roomId, createdAt: { $lt: before } })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}
