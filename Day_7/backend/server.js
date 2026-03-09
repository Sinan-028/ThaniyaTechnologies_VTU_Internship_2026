const express = require('express')
const cors = require('cors')

const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())

app.use(express.json())

app.use(logger)

app.use('/api', userRoutes)

app.use(errorHandler)

app.listen(5000, () => {
    console.log("Server running on port 5000")
})