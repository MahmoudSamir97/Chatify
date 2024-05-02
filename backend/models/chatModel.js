const { Schema, Types, model } = require('mongoose');

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      default: 'sender',
      trim: true,
    },

    chatImage: {
      secure_url: {
        type: String,
        default: '',
      },
      public_id: {
        type: String,
        default: '',
      },
    },

    isGroupChat: {
      type: Boolean,
      default: false,
    },

    users: [{ type: Types.ObjectId, ref: 'User' }],

    latestMessage: {
      type: Types.ObjectId,
      ref: 'Message',
    },

    groupAdmin: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Chat = model('Chat', chatSchema);

module.exports = Chat;
