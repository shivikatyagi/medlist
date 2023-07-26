require('dotenv/config')
const jwt = require('jsonwebtoken')
const Patient = require('../models/patient')
const Patientauth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(" ")[1];
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const patient = await Patient.findOne({ id: decoded.id, 'Tokens.token': token })
        
        
        if (!patient) {
            throw new Error()
        }
        // console.log(patient);
        req.token = token
        req.patient = patient
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = Patientauth