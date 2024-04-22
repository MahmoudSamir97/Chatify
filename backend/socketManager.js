const { Server } = require('socket.io');

const userSocketMap = {}; // {userId: socketId}

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const addUserSocket = (userId, socketId) => {
  userSocketMap[userId] = socketId;
};

const removeUserSocket = (userId) => {
  delete userSocketMap[userId];
};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  const userSocketMap = {};

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != 'undefined') userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });

  return io;
};

module.exports = {
  getReceiverSocketId,
  addUserSocket,
  removeUserSocket,
  initSocket,
};
