const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  // 1) Create transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "E-Commerce <E-Commerce@ecommerce.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //   3) Send the email
  await transport.sendMail(mailOptions);
};
