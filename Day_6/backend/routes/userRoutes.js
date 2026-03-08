const express = require('express')
const router = express.Router()

const checkAdmin = require('../middleware/checkAdmin')

let users = [
  { id:1, name:"TOM" },
  { id:2, name:"JERRY" }
]

router.get('/users', (req,res)=>{
  res.json(users)
})

router.get('/admin', checkAdmin, (req,res)=>{
  res.send("Welcome Admin")
})

module.exports = router