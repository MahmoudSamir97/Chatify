const { Schema, Types, model } = require('mongoose');

const messageSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // createdAt, updatedAt
  },
  { timestamps: true }
);

const Message = model('Message', messageSchema);

module.exports = Message;
