const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const from = '"MMT Online Shop" <noreply@mmtshop.com>';
const sendConfirmationEmail = user => {
  const transport = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
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
  const transport = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
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
      template: 'reset-pass',
      message: {
        to: user.email,
      },
      locals: {
        name: user.firstName,
        resetUrl: user.generateResetPasswordLink(),
      },
    })
    .then(console.log)
    .catch(console.error);
};

const sendOrderConfirmationEmail = (user, order) => {
  const copyRecipient = user.csr.email === 'info@mmt.com' ? 'jsams@mmt.com' : user.csr.email;
  const transport = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
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
        cc: copyRecipient,
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
