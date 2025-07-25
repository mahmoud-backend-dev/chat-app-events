import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { ChatEventsGateway } from './chat-events.gateway';
@Module({
  imports: [MessageModule],
  providers: [ChatEventsGateway],
  exports: [ChatEventsGateway],
})
export class ChatEventsModule {}
