// src/models/user.model.js
const mongoose = require('mongoose');

const palcodeUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true
  },
  auth: {
    otp: String,
    otpExpires: Date
  },
  youtube: {
    connected: {
      type: Boolean,
      default: false
    },
    lastConnected: Date,
    credentials: {
      access_token: String,
      refresh_token: String,
      expiry_date: Number
    }
  }
}, {
  timestamps: true,
  collection: 'palcode_users' // Specify custom collection name
});

// Indexes
palcodeUserSchema.index({ email: 1 });
palcodeUserSchema.index({ 'youtube.connected': 1 });

const PalcodeUser = mongoose.model('PalcodeUser', palcodeUserSchema);

module.exports = PalcodeUser;