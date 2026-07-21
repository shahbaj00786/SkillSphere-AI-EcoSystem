// server.js mein
import { createServer } from 'http';
import { Server } from 'socket.io';
import setupChatSocket from './sockets/chat.socket.js';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: env.clientUrl, credentials: true } });
setupChatSocket(io);
httpServer.listen(env.port);