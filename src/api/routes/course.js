const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const router = new express.Router()
const {createCourse,getAllCourses,getAllFreeCourses,getPopularCourses,deleteCourse,comfirmPayAndAddCourseToUser} = require('../controllers/course')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


require("dotenv").config();

// Create a course
const cpUpload = upload.fields([{ name: 'course_header_image', maxCount: 1 }, { name: 'media_upload', maxCount: 50 }])
router.post('/course', cpUpload, createCourse);

// get most-popular courses
router.get('/courses/most-popular', authAdmin, getPopularCourses);

// get all courses
router.get('/courses', authAdmin, getAllCourses);

// get all free courses
router.get('/course/free', authAdmin, getAllFreeCourses);
 
//delete a course
router.delete('/course', authAdmin, deleteCourse);

//when a user buys a course 
router.put('/course',authAdmin, comfirmPayAndAddCourseToUser);





module.exports = router