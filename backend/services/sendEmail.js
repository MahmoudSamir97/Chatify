const nodemailer = require('nodemailer');
const sendeEmail = async (email, subject, templateUsed, url, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT),
      secure: process.env.SECURE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.USER, // sender address
      to: email,
      subject,
      html: templateUsed(url, userName),
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendeEmail;
