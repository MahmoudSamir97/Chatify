require('dotenv').config();
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const { globaleErrorHandler } = require('./controllers/errorController');
const messageRouter = require('./routes/message.Routes');
const connectToMongoDB = require('./config/DBconfig');
const AppError = require('./utils/error-handlers/AppError');
const chatRouter = require('./routes/chat.routes');
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);

const userSocketMap = {}; // {userId: socketId}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    console.log('user joinded room', room);
    socket.join(room);
  });

  socket.on('newMessage', (newMessage) => {
    const chat = newMessage.chat;

    if (!chat.users) return console.log('no chat users');

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit('message recieved', newMessage);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    delete userSocketMap[userId];

    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globaleErrorHandler);

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Listening to server on port ${PORT}`);
});
