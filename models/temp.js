const mongoose = require('mongoose')
require('dotenv').config()
const tempSchema = new mongoose.Schema({
    PatientName: {
        type: String,
        trim: true
    },
    Age:{
        type: Number,
        trim: true
    },
    HospitalID: {
        type: String,
        // required: true,
        trim: true,
        ref: 'Hospital'
    },
    HospitalName: {
        type: String,
        trim: true
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
    Phone:{
        type: String,
    },
})

const Temp = mongoose.model('Temp', tempSchema)

module.exports = Temp