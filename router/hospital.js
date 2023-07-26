const express = require('express')
const Hospital = require('../models/hospital')
const Patient = require('../models/patient')
const multer = require('multer')
const auth = require('../middleware/hospital_auth')
const sharp = require('sharp')
const jwt = require('jsonwebtoken')
const router = new express.Router()

router.post('/createHospital', async(req,res)=>{
   
    try{
        const existinghospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
        if(!existinghospital){
            const hospital = new Hospital(req.body)
            const token = jwt.sign({ _id: hospital._id.toString() }, process.env.JWT_SECRET)
            hospital.Tokens = hospital.Tokens.concat({ token })
            await hospital.save()
            console.log(token);
            res.status(200).send({token,hospital})
        }
        else{
            res.status(200).send("hospital already exists")
        }
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/hospital/login',async(req,res)=>{
    const hospital = await Hospital.findOne({Phone:req.body.Phone})
    if(!hospital){
        res.status(200).send("Hospital not found , register first")
    }
    const token = jwt.sign({ _id: hospital._id.toString() }, process.env.JWT_SECRET)
    hospital.Tokens = hospital.Tokens.concat({ token })
    await hospital.save()
    res.status(200).send("You have logged in")
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

router.get('/hospitalDetail',auth,async(req,res)=>{
    try{
        res.status(201).send(req.hospital)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/nonVerifiedPatient',auth,async(req,res)=>{
    try{
        const patient = await Patient.find({HospitalID:req.hospital.id,Verified:'not verified'}).select("id PatientName Phone Verified")
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


router.post('/addingMedicines',auth,async(req,res)=>{
    try{
        const patient = await Patient.findOne({id:req.body.id, HospitalID:req.hospital.id})
        const { MedicineName, Picture, TimeTaken } = req.body;
        const DateAdded = new Date();
        patient.Medicine.push({
            MedicineName,
            Picture,
            TimeTaken,
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
        const patient = await Patient.findOne({id:req.body.id, HospitalID:req.hospital.id})
        const { Description, TimeTaken } = req.body;
        const DateAdded = new Date();
        patient.Exercise.push({
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
        const patient = await Patient.findById(req.body.id)
        if(!patient)
            res.status(404).send("patient not found")
        patient.BalancedDiet.WhatToEat.push(req.body.d)
        patient.save()
        res.status(201).send("diet added successfully")
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addingWhatNotToEat',auth, async(req,res)=>{
    try{
        const patient = await Patient.findById(req.body.id)
        if(!patient)
            res.status(404).send("patient not found")
        patient.BalancedDiet.WhatNotToEat.push(req.body.d)
        patient.save()
        res.status(201).send("diet added successfully")
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
        const patient = await Patient.findOne({_id:req.body.patient_id})
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

const upload = multer({
    limits:{
        fileSize: 100000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)){
        return cb(new Error('Please upload right file format'))
        }
        cb(undefined,true)
    }
    
})

router.post('/addingReports',upload.single('reports'),auth,async(req,res)=>{
    try{
        const patient = await Patient.findById(req.body.id)
        if(!patient)
            res.status(404).send("patient not found")
        patient.Reports.file=req.file.buffer
        patient.Reports.Description=req.body.Description
        patient.Reports.DateAdded=req.body.DateAdded
        await patient.save()
        console.log("xcvbn");
        res.status(200).send("file saved")

    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router