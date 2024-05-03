const Chat = require('../models/chatModel.js');
const User = require('../models/userModel.js');
const AppError = require('../utils/error-handlers/AppError.js');
const { catchAsync } = require('../utils/error-handlers/catchAsync.js');

const findPrivateChat = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) return next(new AppError(400, 'User not provided'));

  let newChatWithPopulated = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users')
    .populate('latestMessage');

  newChatWithPopulated = await User.populate(newChatWithPopulated, {
    path: 'latestMessage.sender',
    select: 'username profileImage email',
  });

  if (newChatWithPopulated)
    return res.status(200).json({ newChatWithPopulated });

  next();
});

module.exports = findPrivateChat;
