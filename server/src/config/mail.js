const nodemailer = require('nodemailer');

class MailConfig {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false 
        }
      });

      this.transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP connection error:', error);
        } else {
          console.log('SMTP server is ready to send emails');
        }
      });
    } catch (error) {
      console.error('Mail configuration error:', error);
      throw error;
    }
  }

  getTransporter() {
    if (!this.transporter) {
      this.initialize();
    }
    return this.transporter;
  }
}

module.exports = new MailConfig();