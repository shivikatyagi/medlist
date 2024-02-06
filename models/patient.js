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
    Hospital: [{
        HospitalID: {
            type: mongoose.Types.ObjectId,
            required: true,
            trim: true,
            ref: 'Hospital'
        },
        HospitalName: {
            type: String,
            required: true,
            trim: true,
            ref: 'Hospital'
        },
        Address: {
            type: String,
            required: true,
            trim: true,
            ref: 'Hospital'
        },
        DoctorName: {
            type: String,
            required: true,
            trim: true,
            ref: 'Hospital'
        },
    }],
    Phone:{
        type: String,
        unique:true,
        required:true
    },
    Verified:{
        type: String,
        required:true,
        enum : ['true','false']
    },
    Medicine:[{
        MedicineName: {
            type: String,
            trim: true
        },
        Picture:{
            type: String,
            trim: true,
        },
        TimeTaken:{
            type: Date,
        },
        DateAdded:{
            type: Date,
        }
    }],
    Exercise:[{
        Description: {
            type: String,
            trim: true
        },
        TimeTaken:{
            type: Date,
        },
        DateAdded:{
            type: Date,
        }
    }],
    BalancedDiet:{
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
            type: Date,
        },
        DateAdded:{
            type: Date,
        }
    },
    Reports:[{
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
    Appointment:{
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
    },
    Tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
    
})

const Patient = mongoose.model('Patient', patientSchema)

module.exports = Patient