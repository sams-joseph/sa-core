const nodemailer = require('nodemailer');

const from = '"Sepsis Awareness Boards" <noreply@sepsisboards.com>';

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const sendConfirmationEmail = user => {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: 'Welcome to Sepsis Awareness Boards',
    text: `
    Hi ${user.firstName}
    Welcome to Sepsis Awareness Boards. Please confirm your email.

    ${user.generateConfirmationUrl()}
    `,
  };

  transport.sendMail(email);
};

const sendResetPasswordEmail = user => {
  const transport = setup();
  const email = {
    from,
    to: user.email,
    subject: 'Reset Password',
    text: `
    To reset your password click the link below

    ${user.generateResetPasswordLink()}
    `,
  };

  transport.sendMail(email);
};

module.exports = { sendConfirmationEmail, sendResetPasswordEmail };
