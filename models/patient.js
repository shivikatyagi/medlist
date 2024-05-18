const mongoose = require('mongoose')
require('dotenv').config()
const patientSchema = new mongoose.Schema({
    PatientName: {
        type: String,
        required: true,
        trim: true
    },
    Age: {
        type: Number,
        required: true,
        trim: true
    },
    Gender:{
        type: String,
        required: true,
        trim: true
    },
    Hospital: [{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: 'Hospital'
        },
        HospitalName: {
            type: String,
            trim: true,
            ref: 'Hospital'
        },
        Address: {
            type: String,
            trim: true,
            ref: 'Hospital'
        },
        DoctorName: {
            type: String,
            trim: true,
            ref: 'Hospital'
        },
        Verified:{
            type: String,
            required:true,
            enum : ['true','false']
        },
    }],
    Phone:{
        type: String,
        unique:true,
        required:true
    },
    Medicine:[{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: 'Hospital'
        },
        MedicineName: {
            type: String,
            trim: true
        },
        TimeTaken:{
            type: String,
        },
        MealTime:{
            type:String
        },
        Picture:{
            type: String,
            trim: true,
        },
        DateAdded:{
            type: Date,
        }
    }],
    PrevMedicine:[{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: 'Hospital'
        },
        MedicineName: {
            type: String,
            trim: true
        },
        TimeTaken:{
            type: String,
        },
        MealTime:{
            type:String
        },
        Picture:{
            type: String,
            trim: true,
        },
        DateAdded:{
            type: Date,
        }
    }],
    Exercise:[{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: 'Hospital'
        },
        Description: {
            type: String,
            trim: true
        },
        TimeTaken:{
            type: String,
        },
        DateAdded:{
            type: Date,
        }
    }],
    BalancedDiet:{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: 'Hospital'
        },
        WhatToEat:[
            {
                type: String,
                trim: true
            }
        ],
        WhatNotToEat:[
            {
                type: String,
                trim: true
            }
        ],
        TimeTaken:{
            type: String,
        },
        DateAdded:{
            type: Date,
        }
    },
    Reports:[{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            trim: true,
            ref: 'Hospital'
        },
        Description: {
            type: String,
            trim: true
        },
        file:{
            type:Buffer
        },
        DateAdded:{
            type: Date,
        }
    }],
    Appointment:[{
        HospitalID:{
            type: mongoose.Types.ObjectId,
        },
        Date:{
            type: String
        },
        slot:{
            type: String
        },
        status:{
            type: String,
            enum : ['done','left']
        }
    }],
    Tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
    
})

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient