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
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    profilePic: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // createdAt, updatedAt => Member since <createdAt>
  },
  { timestamps: true }
);

const User = model('User', userSchema);

module.exports = User;
