const express = require('express')
const router = new express.Router()
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const aws  = require('aws-sdk')
const multer  = require('multer')
const multerS3  = require('multer-s3')
// const { S3Client } = require('@aws-sdk/client-s3')


const {returnCoursesObject,createCourse,getAllCourses,getAllFreeCourses,getPopularCourses,deleteCourse,comfirmPayAndAddCourseToUser,getUserActiveCourses,getAllBoughtCourses} = require('../controllers/course')

// const upload = multer({ dest: './public/data/uploads/' })
// Set S3 endpoint to DigitalOcean Spaces

const endpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT)

const s3 = new aws.S3({           
    endpoint: endpoint,
    accessKeyId:process.env.DO_SPACES_KEY,
    secretAccessKey:process.env.SDO_SPACES_SECRET,
   
  });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'opex',
    acl: 'public-read',
    
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+file.originalname.substring(file.originalname.length - 15,file.originalname.length))
    }
  })
})

// Create a course
// const cpUpload = upload.fields([{ name: 'course_header_image', maxCount: 1 }, { name: 'media_upload', maxCount: 49,minCount:0 }])
router.post('/course', upload.single( 'course_header_image'), createCourse);

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