const mongoose = require('mongoose')
require('dotenv').config()
const hospitalSchema = new mongoose.Schema({
    HospitalName: {
        type: String,
        required: true,
        trim: true
    },
    DoctorName:{
        type: String,
        required: true,
        trim: true
    },
    Address:{
        type: String,
        required: true,
        trim: true
    },
    Phone:{
        type: String,
        required: true,
        trim: true
    }

})

const Hospital = mongoose.model('Haspital', hospitalSchema)

module.exports = Hospital