const { Schema, Types, model } = require('mongoose');

const tokenSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tokenSchema.methods.hasExpired = function () {
  const now = Date.now();
  const isExpired =
    now - this.createdAt.getTime() > 10 * 60 * 1000; /* 10 minutes */
  return isExpired;
};

const Token = model('Token', tokenSchema);

module.exports = Token;
