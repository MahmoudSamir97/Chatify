require('dotenv').config();
const express = require('express');
const { app, server } = require('./socket/socketManager');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const { globaleErrorHandler } = require('./controllers/errorController');
const messageRouter = require('./routes/message.Routes');
const connectToMongoDB = require('./config/DBconfig');
const AppError = require('./utils/error-handlers/AppError');
const chatRouter = require('./routes/chat.routes');

// GLOBAL MIDDLEWARES
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/chat', chatRouter);
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
