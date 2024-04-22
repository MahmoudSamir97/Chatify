require('dotenv').config();
const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const AppError = require('./utils/AppError');
const { globaleErrorHandler } = require('./controllers/errorController');
const messageRouter = require('./routes/message.Routes');
const connectToMongoDB = require('./config/DBconfig');
const { initSocket } = require('./socketManager');

// GLOBAL MIDDLEWARES
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Socket
const server = http.createServer(app);
const io = initSocket(server);

// const getReceiverSocketId = (receiverId) => {
//   return userSocketMap[receiverId];
// };

// const userSocketMap = {}; // {userId: socketId}

// io.on('connection', (socket) => {
//   console.log('a user connected', socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId != 'undefined') userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all the connected clients
//   io.emit('getOnlineUsers', Object.keys(userSocketMap));

//   // socket.on() is used to listen to the events. can be used both on client and server side
//   socket.on('disconnect', () => {
//     console.log('user disconnected', socket.id);
//     delete userSocketMap[userId];
//     io.emit('getOnlineUsers', Object.keys(userSocketMap));
//   });
// });
// Socket

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

// Error handling
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(globaleErrorHandler);

// Server LISTENing
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Listening to server on port ${PORT}`);
});
module.exports = io;
