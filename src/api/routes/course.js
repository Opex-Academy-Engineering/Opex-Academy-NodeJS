const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const jwt = require('jsonwebtoken')
const Course = require('../../models/course')
const router = new express.Router()
const {createCourse,getAllCourses,getAllFreeCourses,deleteCourse} = require('../controllers/course')
const formidable = require('formidable');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const form = formidable({ multiples: true });

require("dotenv").config();

// Create a course
router.post('/course', authAdmin, createCourse);

// get all courses
router.get('/courses', authAdmin, getAllCourses);

// get all free courses
router.get('/course/free', authAdmin, getAllFreeCourses);
 
//delete a course
router.delete('/course', authAdmin, deleteCourse);





module.exports = router