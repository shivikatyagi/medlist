const express = require('express')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Temp = require('../models/temp')
const auth = require('../middleware/patient_auth')
const sendSMS = require('../verification/send')
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken')
const router = new express.Router()

// const generateOTP = async function(){
//     var otp = Math.random()
//     otp = otp * 10000
//     otp = parseInt(otp)
    
//     return otp
//     }

router.post('/RegisterationDetails', async(req,res)=>{
    try{
        const existinghospital = await Hospital.findOne({DoctorName:req.body.DoctorName,HospitalName:req.body.HospitalName,Address:req.body.Address})
        if(existinghospital){
            const existingpatient=await Patient.findOne({Phone:req.body.Phone,Hospital:{
                HospitalName:req.body.HospitalName,Address:req.body.Address,DoctorName:req.body.DoctorName
            }})    
            if(!existingpatient){
                const temppatient= new Temp(req.body)
                // let otp = otpGenerator.generate(4, {
                //     upperCaseAlphabets: false,
                //     lowerCaseAlphabets: false,
                //     specialChars: false,
                //   });
                temppatient.HospitalID=existinghospital.id
                // temppatient.otp=otp
                await temppatient.save()

                console.log("fgfhgjhfc");
                console.log(temppatient.id);
                res.status(200).send(temppatient)
            }
            else{
                res.status(200).send("User already exists.....you want to login ?")
            }
        }
        else{
            res.status(200).send("hospital is not registered")
        }
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/RegisteringPatient', async(req,res)=>{
    try{ 
        const user=await Temp.findOne({_id:req.query.id})
        const patient = await Patient.findOne({Phone:user.Phone})
        console.log(user)
        console.log("gchvjbknlm")
        if(req.query.mssg=='success'){
            if(!patient){
                patient =new Patient();
                patient.PatientName = user.PatientName;
                patient.Age = user.Age;
                patient.Phone = user.Phone;
                const data= { 
                    HospitalID:user.HospitalID,
                    HospitalName:user.HospitalName,
                    DoctorName:user.DoctorName,
                    Address:user.Address,
                    Verified:'false'
                }
                patient.Hospital.push(data);
            }
            else{
                console.log("hcvjhbknlmbhvghcgvjhbkjnlk")
                const data= { 
                    HospitalID:user.HospitalID,
                    DoctorName:user.DoctorName,
                    HospitalName:user.HospitalName,
                    Address:user.Address,
                    Verified:'false'
                }
                patient.Hospital.push(data);
            }
            const token = jwt.sign({ _id: patient._id.toString() }, process.env.JWT_SECRET)
            patient.Tokens = patient.Tokens.concat({ token })
            await patient.save()
            console.log(patient.id)
            await Temp.findByIdAndDelete(req.body.id);
            res.status(200).send({patient,token})
        }
        else{
            res.status(201).send("wrong otp")
        }
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/patient/send-login',async(req,res)=>{
    try{
        const existingpatient = await Patient.findOne({Phone:req.body.Phone})  
        if(existingpatient){
            res.status(200).send(existingpatient._id)
            }
        else{
            res.status(200).send("No data found for the user.....register first")
        }
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/patient/verification-login',async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.query.id})
        if(req.query.mssg=='success'){
            const token = jwt.sign({ _id: patient._id.toString() }, process.env.JWT_SECRET)
            patient.Tokens = patient.Tokens.concat({ token })
            await patient.save()
            res.status(201).send({patient,token})
        }
        else{
            res.status(201).send("wrong otp")
        }
    }catch(e){ 
        res.status(400).send(e)
    }
})


router.post('/patient/logout',auth,async(req,res)=>{
    try{
        req.patient.Tokens = req.patient.Tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.patient.save()
        res.send("you are logged out")
    }catch(e){
            res.status(500).send()
    }
})
 
router.post('/patient/logoutAll',auth, async(req,res)=>{
    try{
        req.patient.Tokens=[]
        await req.patient.save()
        res.send("you are logged out from all devices")
    }catch(e){
        res.status(500).send()
    }
})

router.get('/patientDetail',auth,async(req,res)=>{
    try{
        const patient = await Patient.findOne({_id:req.patient._id}).select("id PatientName Hospital.HospitalName Hospital.HospitalID Hospital.Address Hospital.DoctorName Phone")
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/HospitalDetailPatient',auth,async(req,res)=>{
    try{
        const hospital = await Hospital.findOne({'Hospital.HospitalID':req.params.hid})
        res.status(200).send(hospital)
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/addingMedicinesPatient',auth,async(req,res)=>{
    try{
        const pat = await Patient.findOne({'Hospital.HospitalID':req.body.hid,_id:req.patient._id})
        const { MedicineName,TimeTaken,MealTime ,Picture} = req.body;
        const DateAdded = new Date();
        pat.Medicine.push({
            MedicineName,
            TimeTaken,
            MealTime,
            Picture,
            DateAdded
          });
          pat.PrevMedicine.push({
            MedicineName,
            TimeTaken,
            MealTime,
            Picture,
            DateAdded
          });
        pat.save()
        res.status(201).send(pat.Medicine)
    }catch(e){
        res.status(400).send(e)
    }
})

router.patch('/deleteMedicinePatient',auth, async(req,res)=>{
    try{ 
    await Patient.updateOne({_id:req.patient_id}, {
        $pull: {
            Medicine: {_id: req.body.medicine_id}
        }
      });
            res.status(200).send("medicine deleted")
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/deleteAllMedicinesPatient',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.patient._id})
        console.log(patient);
        patient.Medicine=[]
        patient.save()
        res.status(200).send("All medicines are deleted")
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/MedicineRecord',auth, async(req,res)=>{
    try{ 
        const patient = await Patient.findOne({_id:req.patient._id})
        res.status(200).send(patient.PrevMedicine)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/bookAppointment', auth,async(req,res)=>{
    try{ 
        const appointment = {
            HospitalID: req.body.hid,
            Date:req.body.Date,
            slot:req.body.slot,
            status:'left'
        }
        req.patient.Appointment.push(appointment)
        req.patient.save()
        res.status(200).send(appointment)
        
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/Medicine', auth,async(req,res)=>{
    try{ 
        res.status(200).send(req.patient.Medicine)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/Exercise', auth,async(req,res)=>{
    try{ 
        res.status(200).send(req.patient.Exercise)
        
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/Diet', auth,async(req,res)=>{
    try{ 
        res.status(200).send(req.patient.BalancedDiet)
        
    }catch(e){
        res.status(400).send(e)
    }
})




module.exports = router