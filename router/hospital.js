const express = require('express')
const Hospital = require('../models/hospital')
const TempHospital = require('../models/temphospital')
const Patient = require('../models/patient')
const { VerifyEmail} = require('../email/account')
const otpGenerator = require('otp-generator');
const multer = require('multer')
const auth = require('../middleware/hospital_auth')
const sharp = require('sharp')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = new express.Router()

router.post('/Create_Hospital', async(req,res)=>{
    try{
            const existinghospital = await Hospital.findOne({Email:req.body.DoctorName,DoctorName:req.body.DoctorName,HospitalName:req.body.HospitalName,Address:req.body.Address})
            if(!existinghospital){
                const temphospital = new TempHospital(req.body)
                temphospital.Password = await bcrypt.hash(req.body.Password, 8)
                let otp = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                  });
                temphospital.EmailOtp=otp
                console.log(otp);
                console.log(temphospital.EmailOtp);
                await VerifyEmail(temphospital.Email,otp)
                await temphospital.save()
                res.status(201).send(temphospital)
            }
            else{
                res.status(200).send("doctor already exists, want to login ?")
            }
        
    }catch(e){
        res.status(400).send(e)
    }
})

// router.get('/SendOtpEmail', async(req,res)=>{
//     try{
//                 const hs = await TempHospital.findOne({id:req.params.id})
//                 let otp = otpGenerator.generate(4, {
//                     upperCaseAlphabets: false,
//                     lowerCaseAlphabets: false,
//                     specialChars: false,
//                   });
//                 hs.EmailOtp=otp
//                 await hs.save()
//                 await VerifyEmail(hs.Email,otp)
//                 console.log(otp);
//                 res.status(200).send("otp sent")
        
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.post('/VerifyEmail', async(req,res)=>{
    try{
                const hs = await TempHospital.findOne({_id:req.query.id})
                let otp = req.body.otp
                if(hs.EmailOtp==otp){
                    hs.EmailVerified="true"
                    await hs.save()
                    if(hs.PhoneVerified=='true'){
                        const hospital = new Hospital({...hs.toObject()})
                        const token = jwt.sign({ _id: hospital._id.toString() }, process.env.JWT_SECRET)
                        hospital.Tokens = hospital.Tokens.concat({token})
                        await hospital.save()
                        res.status(201).send(hospital)
                    }
                    else
                    res.status(200).send("email verified")
                }
                else{
                    res.status(200).send("Wrong otp")
                }
        
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/VerifyPhone', async(req,res)=>{
    try{
            const hs = await TempHospital.findOne({_id:req.query.id})
                if(req.query.mssg=="success"){
                    console.log("fxdghjkhgfxdzcfg")
                    hs.PhoneVerified='true'
                    await hs.save()
                    if(hs.EmailVerified=='true'){
                        const hospital = new Hospital({...hs.toObject()})
                        const token = jwt.sign({ _id: hospital._id.toString() }, process.env.JWT_SECRET)
                        hospital.Tokens = hospital.Tokens.concat({token})
                        await hospital.save()
                        res.status(201).send({token,hospital})
                    }
                    else
                    res.status(200).send("phone number verified")
                }
                else{
                    res.status(200).send("Wrong otp")
                }
        
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login_Hospital', async(req,res)=>{
    try{
        const hospital = await Hospital.findOne({Email:req.body.Email })
        if (!hospital) {
            res.status(404).send('Wrong email or password')
        }
        const isMatch = await bcrypt.compare(req.body.Password, hospital.Password)
        if (!isMatch) {
            res.status(404).send('Wrong email or password')
        } 
        else{
            const token = jwt.sign({ _id: hospital._id.toString() }, process.env.JWT_SECRET)
            hospital.Tokens = hospital.Tokens.concat({token})
            await hospital.save()
            res.status(201).send({token,hospital})
        }
        
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/hospital/logout',auth,async(req,res)=>{
    try{
        req.hospital.Tokens = req.hospital.Tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.hospital.save()
        res.send("you are logged out")
    }catch(e){
            res.status(500).send()
    }
})

 
router.post('/hospital/logoutAll',auth, async(req,res)=>{
    try{
        req.hospital.Tokens=[]
        await req.hospital.save()
        res.send("you are logged out from all devices")
    }catch(e){
        res.status(500).send()
    }
})

// router.post('/ForgotPassword',async(req,res)=>{
//     try{
//         const hospital = await Hospital.findOne({_id:req.body.hospital_id })
//         if (!hospital) {
//             res.status(404).send('Hospital with this hospital id does not exist')
//         }
//         if(req.body.Password!=req.body.ConfirmPassword)
//         res.send("Confirm Passwprd should be same as Password")
//         const isMatch = await bcrypt.compare(req.body.Password, hospital.Password)
//         if (isMatch) {
//             res.status(404).send('new passwword should not be same as old password')
//         } 
//         hospital.Password = await bcrypt.hash(req.body.Password, 8)
//        // hospital.Tokens=[]
//         hospital.save()
//         res.send("Password has changed ....Please login with updated password")
//     }catch(e){
//             res.status(500).send()
//     }
// })

router.get('/hospitalDetail',auth,async(req,res)=>{
    try{
        res.status(201).send(req.hospital)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/nonVerifiedPatient',auth,async(req,res)=>{
    try{
        const patient = await Patient.find({Hospital:{HospitalID:req.hospital.id,Verified:'not verified'}}).select("id PatientName Phone Verified")
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/verifyingPatient',auth, async(req,res)=>{
    try{
        const patient = await Patient.findOne({_id:req.body.id})
        patient.Verified='true'
        patient.save()
        res.status(201).send("patient verified")
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/allHospitals', async(req,res)=>{
    try{
        const hospital=await Hospital.find()
        res.status(200).send(hospital)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/SearchPatient',auth, async(req,res)=>{
    try{
        console.log(req.query.key);
        const data = await Patient.find({
            HospitalName: req.hospital.HospitalName,
            $or: [
                { PatientName: { $regex: req.query.key, $options: 'i' } }, 
                { Phone: { $regex: req.query.key, $options: 'i' } }, 
                { id: { $regex: req.query.key, $options: 'i' } },
              ],
        })
        if(data.length > 0)
        res.status(200).send(data)
        else
        res.status(200).send("no data found")
    }catch(e){
        res.status(400).send(e)
    }
})
0


router.post('/addingMedicines',auth,async(req,res)=>{
    try{
        const patient = await Patient.findOne({'Hospital.HospitalID':req.hospital._id,_id:req.body.id})
        const HospitalID = req.hospital._id
        const { MedicineName,TimeTaken,MealTime ,Picture} = req.body;
        const DateAdded = new Date();
        patient.Medicine.push({
            HospitalID,
            MedicineName,
            TimeTaken,
            MealTime,
            Picture,
            DateAdded
          });
          patient.PrevMedicine.push({
            HospitalID,
            MedicineName,
            TimeTaken,
            MealTime,
            Picture,
            DateAdded
          });
        patient.save()
        res.status(201).send(patient.Medicine)
    }catch(e){
        res.status(400).send(e)
    }
})


router.patch('/deleteMedicine',auth, async(req,res)=>{
    try{ 
    await Patient.updateOne({_id:req.body.patient_id}, {
        $pull: {
            Medicine: {_id: req.body.medicine_id}
        }
      });
            res.status(200).send("medicine deleted")
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/deleteAllMedicines',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.body.patient_id})
        console.log(patient);
        patient.Medicine=[]
        patient.save()
        res.status(200).send("All medicines are deleted")
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/addingExercises',auth, async(req,res)=>{
    try{
        const patient = await Patient.findOne({'Hospital.HospitalID':req.hospital._id,_id:req.body.id})
        const HospitalID = req.hospital._id
        const { Description, TimeTaken } = req.body;
        const DateAdded = new Date();
        patient.Exercise.push({
            HospitalID,
            Description,
            TimeTaken,
            DateAdded
          });
        patient.save()
        res.status(201).send(patient.Exercise)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/deleteExercise',auth, async(req,res)=>{
    try{ 
        await Patient.updateOne({_id:req.body.patient_id}, {
            $pull: {
                Exercise: {_id: req.body.exercise_id}
            }
          });
                res.status(200).send("exercise deleted")
        }catch(e){
            res.status(400).send(e)
        }
})


router.post('/deleteAllExercises',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.body.patient_id})
        patient.Exercise=[]
        patient.save()
            res.status(200).send("All exercises are deleted")
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addingWhatToEat',auth, async(req,res)=>{
    try{
        const patient = await Patient.findOne({'Hospital.HospitalID':req.hospital._id,_id:req.body.id})
        if(!patient)
            res.status(404).send("patient not found")
        const HospitalID = req.hospital._id
        const FoodItem=req.body.FoodItem
        patient.BalancedDiet.WhatToEat.push({HospitalID,FoodItem})
        patient.save()
        res.status(201).send(patient.BalancedDiet.WhatToEat)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addingWhatNotToEat',auth, async(req,res)=>{
    try{
        const patient = await Patient.findOne({'Hospital.HospitalID':req.hospital._id,_id:req.body.id})
        if(!patient)
            res.status(404).send("patient not found")
        const HospitalID = req.hospital._id
        const FoodItem=req.body.FoodItem
        patient.BalancedDiet.WhatNotToEat.push({HospitalID,FoodItem})
        patient.save()
        res.status(201).send(patient.BalancedDiet.WhatNotToEat)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/deleteWhatToEat',auth, async(req,res)=>{
    try{ 
        await Patient.updateOne({_id:req.body.patient_id}, {
            $pull: {
                 'BalancedDiet.WhatToEat': req.body.diet 
            }
          });
                res.status(200).send("deleted")
        }catch(e){
            res.status(400).send(e)
        }
})

router.patch('/deleteWhatNotToEat',auth, async(req,res)=>{
    try{ 
        await Patient.updateOne({_id:req.body.patient_id}, {
            $pull: {
                 'BalancedDiet.WhatNotToEat': req.body.diet 
            }
          });
                res.status(200).send("deleted")
        }catch(e){
            res.status(400).send(e)
        }
})

router.post('/deleteAllWhatToEat', auth, async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.body.id})
        console.log(patient);
        patient.BalancedDiet.WhatToEat=[]
        patient.save()
            res.status(200).send("All WhatToEats are deleted")
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/deleteAllWhatNotToEat',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.body.patient_id})
        patient.BalancedDiet.WhatNotToEat=[]
        patient.save()
            res.status(200).send("All WhatNotToEats are deleted")
    }catch(e){
        res.status(400).send(e)
    }
})

// const upload = multer({
//     limits:{
//         fileSize: 100000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)){
//         return cb(new Error('Please upload right file format'))
//         }
//         cb(undefined,true)
//     }
    
// })

// router.post('/addingReports',upload.single('reports'),auth,async(req,res)=>{
//     try{
//         const patient = await Patient.findOne({'Hospital.HospitalID':req.hospital._id,_id:req.body.patient_id})
//         if(!patient)
//             res.status(404).send("patient not found")
//         const file=req.file.buffer
//         const Description=req.body.Description
//         const DateAdded=new Date()
//         patient.Reports.push({file,Description,DateAdded})
//         await patient.save()
//         console.log("xcvbn");
//         res.status(200).send("file saved")

//     }catch(e){
//         res.status(400).send(e)
//     }
// })
router.post('/addingReports',auth,async(req,res)=>{
    try{
        const patient = await Patient.findOne({'Hospital.HospitalID':req.hospital._id,_id:req.body.id})
        if(!patient)
            res.status(404).send("patient not found")
        const HospitalID=req.hospital.id
        const Description=req.body.Description
        const file=req.body.file
        const DateAdded=new Date()
        patient.Reports.push({HospitalID,Description,file,DateAdded})
        await patient.save()
        console.log("xcvbn");
        res.status(200).send("file saved")

    }catch(e){
        res.status(400).send(e)
    }
})

// router.get('/appointment/today',auth, async(req,res)=>{
//     try{ 
//         var date = new Date()
//         date=date.toString()
//         console.log(date);
//         const appointments = Patient.find({Hospital:{
//             _id:req.hospital.id
//         }, appointments:{
//             Date:date
//         }})
//         res.status(200).send(appointments)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.get('/appointment/left',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.find({'Hospital.HospitalID':req.hospital._id,'Appointment.Date':req.query.date,'Appointment.status':"left"})
        console.log('Number of patients found:', patient.length);
        const filteredPatients = patient.map(patient => {
            const filteredAppointments = patient.Appointment.filter(appointment =>
                appointment.Date === req.query.date && appointment.status === 'left'
            );
            return {
                _id: patient._id,
                PatientName: patient.PatientName,
                Age: patient.Age,
                Gender: patient.Gender,
                Phone: patient.Phone,
                Appointment: filteredAppointments
            };
        });

        res.status(200).send(filteredPatients);


    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/appointment/done',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.find({'Hospital.HospitalID':req.hospital._id,'Appointment.Date':req.query.date,'Appointment.status':"done"})
        // .select('_id PatientName Age Gender Phone Appointment')
        console.log('Number of patients found:', patient.length);
        const filteredPatients = patient.map(patient => {
            const filteredAppointments = patient.Appointment.filter(appointment =>
                appointment.Date === req.query.date && appointment.status === 'done'
            );
            return {
                _id: patient._id,
                PatientName: patient.PatientName,
                Age: patient.Age,
                Gender: patient.Gender,
                Phone: patient.Phone,
                Appointment: filteredAppointments
            };
        });

        res.status(200).send(filteredPatients);
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/appointment',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.find({'Hospital.HospitalID':req.hospital._id,'Appointment.Date': req.query.date}).select;
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/patient_appointment',auth, async(req,res)=>{
    try{ 
        await Patient.updateOne({_id:req.body.id}, {
            $pull: {
                 'Appointment.status': 'done'
            }
          });
                res.status(200).send("deleted")
        }catch(e){
            res.status(400).send(e)
        }
})

module.exports = router