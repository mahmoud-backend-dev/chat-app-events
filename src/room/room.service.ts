import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schema/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  async createRoom(name: string): Promise<Room> {
    return this.roomModel.create({ name });
  }

  async addMember(roomName: string, userId: string): Promise<Room | null> {
    return this.roomModel.findOneAndUpdate(
      { name: roomName },
      { $addToSet: { members: userId } },
      { new: true, upsert: true },
    );
  }

  async getRoom(name: string): Promise<Room | null> {
    return this.roomModel.findOne({ name });
  }
}
