const express = require('express')
const cors = require('cors')

const logger = require('./middleware/logger')
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(express.json())

app.use(cors())

app.use(logger)

app.use('/api', userRoutes)

app.listen(5000, () => {
    console.log("Server running on ort 5000")
})