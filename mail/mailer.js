const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const from = '"MMT Online Shop" <noreply@mmtshop.com>';

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
  const transport = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const email = new Email({
    message: {
      from,
    },
    views: {
      root: path.join(__dirname, 'emails'),
      options: {
        extension: 'ejs',
      },
    },
    send: true,
    transport,
  });

  email
    .send({
      template: 'confirmation',
      message: {
        to: user.email,
      },
      locals: {
        name: user.firstName,
        confirmationUrl: user.generateConfirmationUrl(),
      },
    })
    .then(console.log)
    .catch(console.error);
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

const sendOrderConfirmationEmail = (user, order) => {
  const transport = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const email = new Email({
    message: {
      from,
    },
    views: {
      root: path.join(__dirname, 'emails'),
      options: {
        extension: 'ejs',
      },
    },
    send: true,
    transport,
  });

  email
    .send({
      template: 'order',
      message: {
        to: user.email,
      },
      locals: {
        orderNumber: order.id + 100000,
        order,
      },
    })
    .then(console.log)
    .catch(console.error);
};

module.exports = { sendConfirmationEmail, sendResetPasswordEmail, sendOrderConfirmationEmail };
