const AppError = require('../utils/error-handlers/AppError.js');
const { catchAsync } = require('../utils/error-handlers/catchAsync.js');

const groupValidator = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line
  let { users, groupName, groupImage } = req.body;

  users = users.split(',');

  if (!users || !groupName)
    return next(new AppError(400, 'Please Fill all the feilds'));

  if (users.length < 2)
    return next(
      new AppError(400, 'More than 2 users are required to form a group chat')
    );

  users.push(req.user._id);

  req.users = users;

  next();
});

module.exports = groupValidator;
