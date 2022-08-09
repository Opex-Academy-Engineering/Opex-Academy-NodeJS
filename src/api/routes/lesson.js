const express = require('express')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const router = new express.Router()
const {returnCoursesObject,createLesson,getAllLessons,getAllFreeCourses,getPopularCourses,deleteCourse,comfirmPayAndAddCourseToUser,getUserActiveCourses,getAllBoughtCourses} = require('../controllers/lesson')



require("dotenv").config();

// Create a leson
router.post('/lesson', createLesson);


// get most-popular courses
router.get('/courses/most-popular', auth, getPopularCourses);

// get all courses
router.get('/lessons', auth, getAllLessons);

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