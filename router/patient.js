const express = require('express')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Temp = require('../models/temp')
const sendSMS = require('../verification/send')
const router = new express.Router()

const generateOTP = async function(){
    var otp = Math.random()
    otp = otp * 10000
    otp = parseInt(otp)
    
    return otp
    }

router.post('/SendPatient', async(req,res)=>{
    try{
        const existinghospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
        if(existinghospital){
            const existingpatient=await Patient.findOne({Phone:req.body.Phone})    
            if(!existingpatient){
                const temppatient= new Temp(req.body)
                otp =await generateOTP();
                await sendSMS(req.body.Phone,otp)
                temppatient.HospitalID=existinghospital.id
                temppatient.otp=otp
                await temppatient.save()
                console.log("fgfhgjhfc");
                console.log(temppatient.id,otp);
                res.status(200).send("sms sent....check your phone")
            }
            else{
                res.status(200).send("User with this phone number already exists.....you want to login ?")
            }
        }
        else{
            res.status(200).send("hospital is not registered")
        }
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/RegisteringPatient', async(req,res)=>{
    try{ 
        const user=await Temp.findById(req.body.id)
        if(user.otp==req.body.otp){
            const verifieduser=new Patient();
            verifieduser.PatientName=user.PatientName
            verifieduser.HospitalName=user.HospitalName
            verifieduser.HospitalID=user.HospitalID
            verifieduser.Phone=user.Phone
            await verifieduser.save()
            console.log(verifieduser.id)
            await Temp.findByIdAndDelete(req.body.id);
            res.status(200).send("registered successfully")
        }
        else{
            res.status(200).send("wrong otp")
        }
    }catch(e){
        res.status(400).send(e)
    }
})




module.exports = router