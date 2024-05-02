const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const { getReceiverSocketId, io } = require('../socket/socketManager');
const { catchAsync } = require('../utils/error-handlers/catchAsync');

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let conversation = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Chat.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    conversation.messages.push(newMessage._id);
  }

  await Promise.all([conversation.save(), newMessage.save()]);

  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  res.status(201).json(newMessage);
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user._id;

  const conversation = await Chat.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate('messages');

  if (!conversation) return res.status(200).json([]);

  const messages = conversation.messages;

  res.status(200).json(messages);
});
