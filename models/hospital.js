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
    },
    Password: {
        type: String,
        required: true,
        minlength: 9,
        trim: true,
        required: true,
    },
    slots:[{
        type:Date
    }],
    Tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

})

const Hospital = mongoose.model('Haspital', hospitalSchema)

module.exports = Hospital