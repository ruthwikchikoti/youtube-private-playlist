const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const mailService = require('./mail.service');
const { generateOTP, hashOTP } = require('../utils/helpers');

class AuthService {
  async sendLoginOTP(email) {
    try {
      const otp = generateOTP();
      const hashedOTP = await hashOTP(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

      await User.findOneAndUpdate(
        { email },
        { 
          email,
          otp: hashedOTP,
          otpExpires: expiresAt 
        },
        { upsert: true }
      );

      await mailService.sendOTPEmail(email, otp);

      return true;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOTP(email, otp) {
    const user = await User.findOne({ 
      email,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new Error('OTP expired or invalid email');
    }

    const isValid = await user.verifyOTP(otp);
    if (!isValid) {
      throw new Error('Invalid OTP');
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return this.generateToken(user);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

module.exports = new AuthService();