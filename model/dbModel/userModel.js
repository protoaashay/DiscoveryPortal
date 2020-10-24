const mongoose = require('mongoose');
const validator = require('validator');

const Tag = require('./tagModel');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name of the user should be specified'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    bio: {
      type: String,
    },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin', 'superAdmin'],
      default: 'user',
    },
    image: {
      type: String,
      default: null,
    },
    publishStatus: {
      type: Boolean,
      default: true,
    },
    verifyStatus: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reporters: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    admissionYear: {
      type: Number,
      max: [new Date().getFullYear(), 'Invalid year of admission'],
    },
    graduationYear: {
      type: Number,
    },
    branch: {
      type: String,
      default: 'Not Specified',
      // enum:[]
    },
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);

userSchema.index({ name: 'text', email: 'text' });

const User = mongoose.model('User', userSchema);
module.exports = User;
