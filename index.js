const express = require('express')
require('./db/mongoose')
const hospitalRouter = require('./router/hospital')
const patientRouter = require('./router/patient')
require('dotenv/config')
const app = express()
// app.use(cors())
const port = process.env.PORT||3000

app.use(express.json())
app.use(hospitalRouter)
app.use(patientRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

