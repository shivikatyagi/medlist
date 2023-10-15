require('dotenv').config();

const nodemailer = require('nodemailer');
async function VerifyEmail(email,id){
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls : {
      rejectUnauthorized : false
    }
 });

const mailOptions = await transporter.sendMail({
    from: process.env.SENDER_EMAIL_USERNAME, 
    to: email, 
    cc: process.env.SENDER_EMAIL_USERNAME,
    bcc: process.env.SENDER_EMAIL_USERNAME,
    subject: 'Email verification', 
    text: `Hi!
           Please follow the given link to verify your email 
           http://localhost:3000/VerifyEmail?id=${id}
           Thanks` 
    
});

}

module.exports = {
  VerifyEmail
}
