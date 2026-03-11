const express = require('express')
const cors = require('cors')

const studentRoutes = require('./routes/studentRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api',studentRoutes)

app.listen(5000,() => {
    console.log("server running on port 5000")
})