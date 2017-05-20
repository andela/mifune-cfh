require('dotenv').config();
const nodemailer = require('nodemailer');


const sendMail = (recipient, link) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PW
    },
  });


  // setup email data with unicode symbols
  const mailOptions = {
    from: '"mifune-cfh <teammifune.cfh@gmail.com>', // sender address
    to: recipient, // list of receivers
    subject: 'Invitation to join a game', // Subject line
    text: 'You have been invited to join a game', // plain text body
    html: `<div><p>You have been invited to join a game
    </p><br><button style="background-color:#233A77; border-radius: 5px;"><a href="${link}" 
    style="text-decoration: none; color: mintcream;">
    Click here to join game.</a></button></div>` // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

module.exports = sendMail;
