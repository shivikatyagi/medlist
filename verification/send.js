// require('dotenv').config();
// const sid = process.env.SID
// const auth_token = process.env.AUTH_TOKEN
// const twilio = require('twilio')(sid,auth_token)

// async function sendSMS(phn,otp){
//     twilio.messages.create({
//             from : process.env.SENDER_NUMBER,
//             to: "+91 9760814509",
//             body : `Hey !!.....Your otp is ${otp}`
//         })
//         .then((res)=>console.log("sms sent"))
//         .catch((err)=>{
//             console.log(err)
//         });
// }
// module.exports = sendSMS





// const admin = require('firebase-admin');

//  const serviceAccount = require('../config/firebase');

//  admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//  });


//  admin.initializeApp({
//     private_key: "AIzaSyAzTsLGY6meAT1H4JSq1HFYhqttZa7BTn4",
//     authDomain: "medlist-8.firebaseapp.com",
//     projectId: "medlist-8",
//     storageBucket: "medlist-8.appspot.com",
//     messagingSenderId: "391571743549",
//     appId: "1:391571743549:web:704b10592d75817c675b54",
//     measurementId: "G-8JWYJFH47D"
//   })

//  const sendSMS = async (phn) => {
//     try {
//       const user = await admin.auth().createUser({
//         phoneNumber: phn,
//       });
//       console.log(`OTP sent to ${phn}`);
//     } catch (error) {
//       console.log(error);
//     }
//   };
 


// module.exports = sendSMS

