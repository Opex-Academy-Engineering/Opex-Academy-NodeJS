const express = require('express')
const auth = require('../middleware/authAdmin')
const jwt = require('jsonwebtoken')
const Course = require('../../models/course')
const router = new express.Router()
const {createCourse,getAllCourses,getAllFreeCourses,deleteCourse} = require('../controllers/course')
const formidable = require('formidable');
const form = formidable({ multiples: true });

require("dotenv").config();

// Create a course
router.post('/course', auth, createCourse);

// get all courses
router.get('/courses', auth, getAllCourses);

// get all free courses
router.get('/course/free', auth, getAllFreeCourses);
 
//delete a course
router.delete("/course", auth, deleteCourse);





module.exports = router