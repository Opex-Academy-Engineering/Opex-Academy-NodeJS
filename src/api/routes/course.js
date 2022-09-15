const express = require('express')
const router = new express.Router()
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const upload = require('../utils/upload')





const {returnCoursesObject,updateCourse,createCourse,getAllCourses,getAllFreeCourses,getPopularCourses,deleteCourse,comfirmPayAndAddCourseToUser,getUserActiveCourses,getAllBoughtCourses} = require('../controllers/course')

// const upload = multer({ dest: './public/data/uploads/' })
// Set S3 endpoint to DigitalOcean Spaces


// Create a course
// const cpUpload = upload.fields([{ name: 'course_header_image', maxCount: 1 }, { name: 'media_upload', maxCount: 49,minCount:0 }])
router.post('/course', upload.single( 'course_header_image'), createCourse);

//
router.patch('/course', upload.fields( [{name:'course_header_image',maxCount: 1},{name:'media_upload'}]), updateCourse);


//return course information
router.get('/course/info', auth, returnCoursesObject);

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