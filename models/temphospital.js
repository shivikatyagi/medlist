const mongoose = require('mongoose')
require('dotenv').config()
const TemphospitalSchema = new mongoose.Schema({
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
        enum : ['true','false'],
        default: 'false'
    },
    Password: {
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        required: true,
    },
    EmailVerified:{
        type: String,
        required:true,
        enum : ['true','false'],
        default: 'false'
    },
    EmailOtp:{
        type: Number,
    },
    PhoneVerified:{
        type: String,
        required:true,
        enum : ['true','false'],
        default: 'false'
    },
    slots:[{
        type:Date
    }],
    // Tokens: [{
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],

})

const TempHospital = mongoose.model('TempHospital', TemphospitalSchema)

module.exports = TempHospital