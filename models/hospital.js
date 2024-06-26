const mongoose = require('mongoose')
require('dotenv').config()
const hospitalSchema = new mongoose.Schema({
    DoctorName:{
        type: String,
        required: true,
        trim: true
    },
    Email: {
        type: String,
        required: true,
        trim: true
    },
    Phone:{
        type: String,
        required: true,
        trim: true
    },
    HospitalName: {
        type: String,
        required: true,
        trim: true
    },
    Address:{
        type: String,
        required: true,
        trim: true
    },
    Gender:{
        type: String,
        required: true,
        trim: true
    },
    Specialization:{
        type: String,
        required: true,
        trim: true
    },
    About:{
        type: String,
        required: true,
        trim: true
    },
    Verified:{
        type: String,
        required:true,
        enum : ['true','false']
    },
    Password: {
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        required: true,
    },
    Tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

})

const Hospital = mongoose.model('Hospital', hospitalSchema)

module.exports = Hospital