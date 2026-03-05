const express = require('express')
const router = express.Router()

const studentController = require('../controllers/studentController')

router.get('/students', studentController.getStudents)

router.post('/students', studentController.addStudent)

router.delete('/students/:id', studentController.deleteStudent)

module.exports = router