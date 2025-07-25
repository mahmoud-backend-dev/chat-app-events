# NestJS Multi-Room Chat App

A scalable real-time chat system built with NestJS, Socket.IO, and MongoDB.

## ✅ Features

- Real-time messaging using Socket.IO
- Create and join chat rooms dynamically
- Messages stored in MongoDB with Mongoose
- Display last 20 messages when joining a room
- Support for private messages (DMs)
- Real-time tracking of online users per room
- JWT-based Socket.IO connection authentication (dummy token)
- Rate limiting: 5 messages per 10 seconds per user per room
- Pagination for loading older messages

## 🧱 Tech Stack

- **Framework:** NestJS
- **WebSockets:** Socket.IO
- **Database:** MongoDB (via Mongoose)
- **Validation:** class-validator
- **Rate Limiting:** In-memory per user per room
- **Authentication:** Dummy JWT middleware

## 🛠️ Installation

```bash
git clone https://github.com/mahmoud-backend-dev/chat-app-events
cd nestjs-multi-room-chat
npm install
npm run start:dev
```

MongoDB must be running locally at: `mongodb://127.0.0.1:27017/chatDB`

## 🧪 Usage

Use any Socket.IO client to connect:

```js
const socket = io('http://localhost:3000', {
  auth: {
    token: 'dummy-jwt',
  },
});
```

### Events

- `joinRoom` — Join a room and receive last 20 messages
- `sendMessage` — Send a public or private message
- `loadMoreMessages` — Load older messages with `{ roomId, before }`
- `roomUsers` — Listen for real-time user list updates
- `newMessage` — Listen for room message broadcasts
- `dm:<receiverId>` — Listen for direct messages

## 📁 Folder Structure

```
src/
├── app.module.ts
├── main.ts
├── app.controller.ts
├── app.service.ts
├── chat-events/
│   ├── chat-events.gateway.ts
│   └── chat-events.module.ts
├── common/
│   ├── middleware/
│   │   └── socket-auth.middleware.ts
│   └── socket-adapter.ts
├── message/
│   ├── dto/
│   │   └── create-message.dto.ts
│   ├── schema/
│   │   └── message.schema.ts
│   ├── message.module.ts
│   └── message.service.ts
├── room/
│   ├── schema/
│   │   └── room.schema.ts
│   ├── room.module.ts
│   └── room.service.ts
├── user/
│   ├── schema/
│   │   └── user.schema.ts
│   ├── user.module.ts
│   └── user.service.ts
```

## 🧪 Testing

Manual testing is via Socket.IO client or Postman WebSocket tools.

Example test message payload:

```json
{
  "roomId": "general",
  "senderId": "user123",
  "content": "Hello!"
}
```

## 📦 Deliverables

- GitHub repo with modular code structure
- README with setup & architecture
- (Optional) Demo video or curl/Postman scripts

---

Made with ❤️ using NestJS & Socket.IO
