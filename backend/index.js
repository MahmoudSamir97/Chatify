const express = require('express');
const app = express();
const authRouter = require('./routes/authRoutes');
const messageRouter = require('./routes/messageRoutes');
const userRouter = require('./routes/userRoutes');

// ROUTES
app.use('api/auth', authRouter);
app.use('api/message', messageRouter);
app.use('api/user', userRouter);

module.exports = app;
