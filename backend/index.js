const express = require('express');
const app = express();
const authRouter = require('./routes/authRoutes');
const messageRouter = require('./routes/messageRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const { globaleErrorHandler } = require('./controllers/errorController');

// ROUTES
app.use('api/auth', authRouter);
app.use('api/message', messageRouter);
app.use('api/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});
app.use(globaleErrorHandler);
module.exports = app;
