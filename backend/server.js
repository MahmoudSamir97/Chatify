require('dotenv').config();
const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const messageRouter = require('./routes/message.Routes');
const chatRouter = require('./routes/chat.routes');
const { globaleErrorHandler } = require('./controllers/errorController');
const hpp = require('hpp');
const { rateLimit } = require('express-rate-limit');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToMongoDB = require('./config/DBconfig');
const AppError = require('./utils/error-handlers/AppError');

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100, // Limit each IP to 100 requests per `window` .
  message: 'Too many requests! try again in one hour',
});

const userSocketMap = {}; // {userId: socketId}

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);

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
  });

  socket.on('join chat', (room) => {
    console.log('user joinded room', room);
    socket.join(room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));

  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('newMessage', (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users.length) return console.log('chat.users not defined');

    const users = chat.isGroupChat
      ? chat.users.map((user) => user._id)
      : [chat.users[0]._id, chat.users[1]._id];

    users.forEach((userId) => {
      socket.broadcast.to(userId).emit('message received', newMessageRecieved);
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
