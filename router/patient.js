const express = require('express')
const Patient = require('../models/patient')
const Hospital = require('../models/hospital')
const Temp = require('../models/temp')
const auth = require('../middleware/patient_auth')
const sendSMS = require('../verification/send')
const jwt = require('jsonwebtoken')
const router = new express.Router()

const generateOTP = async function(){
    var otp = Math.random()
    otp = otp * 10000
    otp = parseInt(otp)
    
    return otp
    }

// router.post('/SendPatient', async(req,res)=>{
//     try{
//         const existinghospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
//         if(existinghospital){
//             const existingpatient=await Patient.findOne({Phone:req.body.Phone})    
//             if(!existingpatient){
//                 const temppatient= new Temp(req.body)
//                 otp =await generateOTP();
//                 await sendSMS(req.body.Phone,otp)
//                 temppatient.HospitalID=existinghospital.id
//                 temppatient.otp=otp
//                 await temppatient.save()
//                 console.log("fgfhgjhfc");
//                 console.log(temppatient.id,otp);
//                 res.status(200).send("sms sent....check your phone")
//             }
//             else{
//                 res.status(200).send("User with this phone number already exists.....you want to login ?")
//             }
//         }
//         else{
//             res.status(200).send("hospital is not registered")
//         }
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// router.post('/RegisteringPatient', async(req,res)=>{
//     try{ 
//         const user=await Temp.findById(req.body.id)
//         if(user.otp==req.body.otp){
//             const verifieduser=new Patient();
//             verifieduser.PatientName=user.PatientName
//             verifieduser.HospitalName=user.HospitalName
//             verifieduser.HospitalID=user.HospitalID
//             verifieduser.Phone=user.Phone
//             verifieduser.Verified='not verified'
//             const token = jwt.sign({ _id: verifieduser._id.toString() }, process.env.JWT_SECRET)
//             verifieduser.Tokens = verifieduser.Tokens.concat({ token })
//             await verifieduser.save()
//             console.log(verifieduser.id)
//             await Temp.findByIdAndDelete(req.body.id);
//             res.status(200).send({verifieduser,token})
//         }
//         else{
//             res.status(201).send("wrong otp")
//         }
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// router.post('/patient/send-login',async(req,res)=>{
//     try{
//         const existinghospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
//         if(existinghospital){
//             const existingpatient=await Patient.findOne({Phone:req.body.Phone})    
//             if(existingpatient){
//                 const temppatient= new Temp(req.body)
//                 otp =await generateOTP();
//                 await sendSMS(req.body.Phone,otp)
//                 temppatient.HospitalID=existinghospital.id
//                 temppatient.otp=otp
//                 await temppatient.save()
//                 console.log("fgfhgjhfc");
//                 console.log(temppatient.id,otp);
//                 res.status(200).send("sms sent....check your phone")
//             }
//             else{
//                 res.status(200).send("No data found for the user.....register first")
//             }
//         }
//         else{
//             res.status(200).send("No data found for the hospital")
//         }
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// router.post('/patient/verification-login',async(req,res)=>{
//     try{ 
//         const user=await Temp.findById(req.body.id)
//         if(user.otp==req.body.otp){
//             const patient=await Patient.findOne({Phone:user.Phone,HospitalName:user.HospitalName}) 
            // const token = jwt.sign({ _id: patient._id.toString() }, process.env.JWT_SECRET)
            // patient.Tokens = patient.Tokens.concat({ token })
            // await patient.save()
//             res.status(200).send({patient,token})
//         }
//         else{
//             res.status(201).send("wrong otp")
//         }
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.post('/patient/SendDetails',async(req,res)=>{
    try{
        const existinghospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
        if(existinghospital){
            const existingpatient=await Patient.findOne({Phone:req.body.Phone})    
            if(!existingpatient){
                res.status(200).send(req.body)
            }
            else{
                res.status(200).send("User with this phone number already exists.....you want to login ?")
            }
        }
        else{
            res.status(200).send("hospital is not registered")
        }
    }catch(e){
            res.status(500).send()
    }
})
router.post('/patient/register',async(req,res)=>{
    try{
        const hospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
        const patient = new Patient(req.body)
        patient.HospitalID=hospital.id
        patient.Verified='not verified'
        const token = jwt.sign({ _id: patient._id.toString() }, process.env.JWT_SECRET)
        patient.Tokens = patient.Tokens.concat({ token })
        await patient.save()
        console.log("hbjnmdsfn");
        res.status(201).send({patient,token})
    }catch(e){
            res.status(500).send()
    }
})

router.post('/patient/SendLoginDetails',async(req,res)=>{
    try{
        const patient = await Patient.findOne({Phone:req.body.Phone,HospitalName:req.body.HospitalName})
        if(!patient)
        res.status(200).send("Enter valid credentials")
        else
        res.status(200).send(req.body)
    }catch(e){
            res.status(500).send()
    }
})

router.post('/patient/login',async(req,res)=>{
    try{
        const patient = await Patient.findOne({Phone:req.body.Phone,HospitalName:req.body.HospitalName})
        const token = jwt.sign({ _id: patient._id.toString() }, process.env.JWT_SECRET)
        patient.Tokens = patient.Tokens.concat({ token })
        await patient.save()
        res.status(201).send({patient,token})
    }catch(e){
            res.status(500).send()
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
        const patient = await Patient.findOne({_id:req.patient._id}).select("id PatientName HospitalName Phone")
        res.status(200).send(patient)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/HospitalDetail',auth,async(req,res)=>{
    try{
        const hospital = await Hospital.findOne({HospitalName:req.patient.HospitalName})
        res.status(200).send(hospital)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/bookAppointment', auth,async(req,res)=>{
    try{ 
        req.patient.Slot=req.body.slot
        const hospital=await Hospital.findOne({_id:req.patient.HospitalID})
        console.log(hospital);
        hospital.slots.push(req.body.slot)
        req.patient.save()
        hospital.save()
        console.log("cvbnm");
        res.status(200).send(req.patient.Slot)
        
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