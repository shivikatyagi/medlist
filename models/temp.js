const mongoose = require('mongoose')
require('dotenv').config()
const tempSchema = new mongoose.Schema({
    PatientName: {
        type: String,
        trim: true
    },
    HospitalName: {
        type: String,
        required: true,
        trim: true
    },
    HospitalID: {
        type: String,
        // required: true,
        trim: true,
        ref: 'Hospital'
    },
    otp:{
        type: Number,
        // required:true
    },
    Phone:{
        type: String,
        required:true,
    },
})

const Temp = mongoose.model('Temp', tempSchema)

module.exports = Temp