const express = require('express')
const Hospital = require('../models/hospital')
const Patient = require('../models/patient')
// const upload = require('../middleware/upload')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()

router.post('/createHospital', async(req,res)=>{
   
    try{
        const existinghospital = await Hospital.findOne({HospitalName:req.body.HospitalName})
        if(!existinghospital){
            const hospital = new Hospital(req.body)
            await hospital.save()
            res.status(200).send("hospital registered")
        }
        else{
            res.status(200).send("hospital already exists")
        }
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/addingMedicines',async(req,res)=>{
    try{
        const patient = await Patient.findOne({id:req.body.id, HospitalID:req.body.HospitalID})
        patient.Medicine.MedicineName = req.body.MedicineName
        patient.Medicine.Picture = req.body.Picture
        patient.Medicine.TimeTaken = req.body.TimeTaken
        patient.Medicine.DateAdded = new Date();
        patient.save()
        res.status(201).send("medicine added successfully")
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addingExercises',async(req,res)=>{
    try{
        const patient = await Patient.findOne({id:req.body.id, HospitalID:req.body.HospitalID})
        patient.Medicine.Description = req.body.MedicineName
        patient.Medicine.TimeTaken = req.body.TimeTaken
        patient.Medicine.DateAdded = req.body.DateAdded
        patient.save()
        res.status(201).send("exercises added successfully")
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/addingWhatToEat',async(req,res)=>{
    try{
        const patient = await Patient.findById(req.body.id)
        patient.BalancedDiet.WhatToEat.push(req.body.d)
        patient.save()
        res.status(201).send("diet added successfully")
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addingWhatNotToEat',async(req,res)=>{
    try{
        const patient = await Patient.findById(req.body.id)
        patient.BalancedDiet.WhatToEat.push(req.body.d)
        patient.save()
        res.status(201).send("diet added successfully")
    }catch(e){
        res.status(400).send(e)
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)){
        return cb(new Error('Please upload right file format'))
        }
        cb(undefined,true)
    }
    
})

router.post('/addingReports',upload.single('reports'),async(req,res)=>{
    try{
        const patient = await Patient.findById(req.body.id)
        patient.Reports.file=req.file.buffer
        await patient.save()
        console.log("xcvbn");
        res.status(200).send(patient.Reports.file)

    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router