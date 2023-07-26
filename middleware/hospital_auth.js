require('dotenv/config')
const jwt = require('jsonwebtoken')
const Hospital = require('../models/hospital')
const Hospitalauth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const hospital = await Hospital.findOne({ id: decoded.id, 'Tokens.token': token  })

        if (!hospital) {
            throw new Error()
        }
        req.token = token
        req.hospital = hospital
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = Hospitalauth