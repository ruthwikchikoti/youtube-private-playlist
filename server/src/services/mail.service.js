const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendOTPEmail(email, otp) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Palcode Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Login to Palcode</h2>
          <p>Your OTP for login is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #4A90E2;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}

module.exports = new MailService();