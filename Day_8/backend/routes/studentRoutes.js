const express = require('express')
const router = express.Router()

const {
    getStudents,
    addStudent,
    deleteStudent
} = require('../controllers/studentController')

router.get('/students', getStudents)
router.post('/students', addStudent)
router.delete('/students/:id', deleteStudent)

module.exports = router