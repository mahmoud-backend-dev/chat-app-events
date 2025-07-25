import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatEventsModule } from './chat-events/chat-events.module';
import { SocketAuthMiddleware } from './common/middlewares/socket-auth.middleware';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV == 'development'
          ? `.env.${process.env.NODE_ENV}`
          : `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    ChatEventsModule,
    MessageModule,
    RoomModule,
    UserModule,
  ],
  providers: [SocketAuthMiddleware],
})
export class AppModule {}
