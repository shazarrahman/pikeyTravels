const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  // Fallback: send using ethereal if possible or console.log
  transporter = {
    sendMail: async (opts) => {
      console.log('sendEmail - no SMTP configured. Email payload:');
      console.log(opts);
      return Promise.resolve();
    }
  };
}

/**
 * sendEmail({ to, subject, text, html })
 */
module.exports = async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error('Missing `to` email');
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@pikeytravels.local',
    to,
    subject: subject || '',
    text: text || undefined,
    html: html || undefined,
  };
  return transporter.sendMail(mailOptions);
};
