const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    bio: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    profileImage: {
      secure_url: {
        type: String,
        default: '',
      },
      public_id: {
        type: String,
        default: '',
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

module.exports = User;
