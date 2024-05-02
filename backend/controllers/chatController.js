const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { uploadImage } = require('../services/cloudinary');
const AppError = require('../utils/error-handlers/AppError');
const { catchAsync } = require('../utils/error-handlers/catchAsync');

exports.createPrivateChat = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  const newChat = await Chat.create({
    isGroupChat: false,
    users: [req.user._id, userId],
  });

  const newChatWithPopulated = await Chat.findById(newChat._id).populate(
    'users'
  );

  res.status(201).json({ newChatWithPopulated });
});

exports.fetchChats = catchAsync(async (req, res, next) => {
  const userChats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate('users')
    .populate('groupAdmin')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  if (!userChats)
    return next(new AppError(404, 'No chats Found for this user'));

  const populatedChats = await User.populate(userChats, {
    path: 'latestMessage.sender',
    select: 'username profileImage email',
  });

  res.status(200).json({ populatedChats });
});

exports.createGroupChat = catchAsync(async (req, res) => {
  const { groupName } = req.body;

  let secure_url, public_id;

  if (req.file) {
    const { secure_url: url, public_id: Id } = await uploadImage(req);
    secure_url = url;
    public_id = Id;
  }

  const groupChat = await Chat.create({
    chatName: groupName,
    users: req.users,
    isGroupChat: true,
    chatImage: {
      secure_url,
      public_id,
    },
    groupAdmin: req.user._id,
  });

  const populatedGroupChat = await Chat.findById(groupChat._id)
    .populate('users')
    .populate('groupAdmin');

  res.status(200).json(populatedGroupChat);
});

exports.renameGroup = catchAsync(async (req, res, next) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users')
    .populate('groupAdmin');

  if (!updatedChat) return next(new AppError(404, 'No chats Found '));

  res.status(200).json({ updatedChat });
});

exports.addToGroup = catchAsync(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const isUserAdded = await Chat.findOne({
    _id: chatId,
    users: { $in: [userId] },
  });

  if (isUserAdded) return next(new AppError(400, 'User already in group chat'));

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users')
    .populate('groupAdmin');

  if (!updatedChat) return next(new AppError(404, 'chat not Found '));

  res.status(200).json({ updatedChat });
});

exports.removeFromGroup = catchAsync(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new AppError(404, 'No chat found'));

  if (String(chat.groupAdmin) === userId)
    return next(new AppError(400, 'Cannot remove group admin'));

  const updatedChat = await Chat.findOneAndUpdate(
    { _id: chatId },
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users')
    .populate('groupAdmin');

  if (!updatedChat) return next(new AppError(404, 'No chats Found '));

  res.status(200).json({ updatedChat });
});

exports.changeGroupImage = catchAsync(async (req, res, next) => {
  const { chatId } = req.body;

  if (!req.file) return next(new AppError(404, 'No image provided'));

  const { secure_url, public_id } = await uploadImage(req);

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatImage: {
        secure_url,
        public_id,
      },
    },
    { new: true }
  );
  res.status(200).json({ updatedChat });
});
exports.deleteGroup = catchAsync(async (req, res, next) => {
  const { chatId } = req.body;

  if (!chatId) return next(new AppError(404, 'Chat id not provided'));

  const chat = await Chat.findById(chatId).populate('groupAdmin');

  if (!chat) return next(new AppError(404, 'No chat found'));

  if (String(chat.groupAdmin._id) !== String(req.user._id))
    return next(new AppError(404, 'You are not allowed to delete group back'));

  await Chat.findByIdAndDelete(chatId);

  res.status(200).json({ message: 'Group deleted successfully' });
});
