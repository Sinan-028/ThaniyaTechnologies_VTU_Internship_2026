const express = require('express')
const router = express.Router()

const validateUser = require('../middleware/validateUser')

let users = [
    { id:1, name:"KIM"},
    { id:2, name:"JIM"}
]

router.get('/users', (req, res) => {
    res.json(users)
})

router.post('/users', validateUser, (req, res) => {
    const user = req.body
    users.push(user)
    res.json(user)
})

module.exports = router