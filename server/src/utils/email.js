const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

const sendOTP = async (email, otp) => {
  const subject = 'Your OTP for Palcode';
  const text = `Your OTP is: ${otp}\nThis OTP will expire in 10 minutes.`;
  return await sendEmail(email, subject, text);
};

module.exports = {
  generateOTP,
  sendEmail,
  sendOTP
};