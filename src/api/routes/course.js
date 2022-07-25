const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const router = new express.Router()
const {returnCoursesObject,createCourse,getAllCourses,getAllFreeCourses,getPopularCourses,deleteCourse,comfirmPayAndAddCourseToUser,getUserActiveCourses,getAllBoughtCourses} = require('../controllers/course')
const multer  = require('multer')
const upload = multer()


require("dotenv").config();

// Create a course
const cpUpload = upload.fields([{ name: 'course_header_image', maxCount: 1 }, { name: 'media_upload', maxCount: 49,minCount:0 }])
router.post('/course', cpUpload, createCourse);

//return course information
router.post('/course/info', cpUpload, returnCoursesObject);

// get most-popular courses
router.get('/courses/most-popular', auth, getPopularCourses);

// get all courses
router.get('/courses', auth, getAllCourses);

// get all free courses
router.get('/course/free', auth, getAllFreeCourses);

// get all active for a user courses
router.get('/course/active', auth, getUserActiveCourses);
 
// get all bought courses
router.get('/course/owned-courses', authAdmin, getAllBoughtCourses);
 
//delete a course
router.delete('/course', authAdmin, deleteCourse);

//when a user buys a course 
router.put('/course',auth, comfirmPayAndAddCourseToUser);





module.exports = router