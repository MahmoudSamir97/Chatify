const { Schema, Types, model } = require('mongoose');

const tokenSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // 1 Hour
    expires: 3600,
  },
});

const Token = model('Token', tokenSchema);

module.exports = Token;
