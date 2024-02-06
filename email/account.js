require('dotenv').config();

const nodemailer = require('nodemailer');
async function VerifyEmail(email,otp){
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
           Your otp is ${otp}.
           Please verify your email using the same.
           Thanks` 
    
});

}

module.exports = {
  VerifyEmail
}
