const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const User = require("../../models/user");
const Facilitator = require("../../models/facilitator");
const OwnedCourse = require("../../models/ownedCourse");
const Course = require("../../models/course");
const authAdmin = require("../../api/middleware/authAdmin");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");





const { getApp } = require("firebase/app");
const {app} = require('../../configs/firebase')
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { constants } = require("buffer");
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

//


const createCourse = async (req, res) => {
  try {

    const file = req.file;

    const uid = uuidv4();
   

    // const deleteData = fs.unlinkSync(filePath);
    const facilitator = await Facilitator.findOne({
      facilitator_id: req.body.facilitator_id,
    });



// await s3.putObjet({Bucket: process.env.DO_SPACES_NAME, Key: "any_file_or_path_name.jpg", Body: file[0].path, ACL: "public"}, (err, data) => {
// if (err) return console.log(err);
// console.log("Your file has been uploaded successfully!", data);
// });

    if (facilitator) {

      const doesCourseExists = await Course.findOne({ title: req.body.title });


      if (!doesCourseExists) {
        const course = new Course({
          title: req.body.title,
          description: req.body.description,
          course_header_image: file.location,
          facilitator: facilitator._id,
          price: req.body.price ?? ""
        });

        await course.save()
         facilitator.courses_facilitated.push(course);
         await facilitator.save();
        return res.status(201).json({
          messaage: "Course created successfully",
          data: course,
        });
      } else {
        return res.status(400).json({
          messaage: `Course with title: ${req.body.title}, already exists`,
          data: {},
        });
      }
    } else {
      return res.status(400).json({
        messaage: "Facilitator not found.",
        data: {},
      });
    }
  } catch (ex) {
    return res
      .status(500)
      .json({ message: "Failed to create course,ma", data: ex.messaage });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const updateCourse = async (req, res) => {
  try {

    const file = req.files;


   

    // const deleteData = fs.unlinkSync(filePath);


// await s3.putObjet({Bucket: process.env.DO_SPACES_NAME, Key: "any_file_or_path_name.jpg", Body: file[0].path, ACL: "public"}, (err, data) => {
// if (err) return console.log(err);
// console.log("Your file has been uploaded successfully!", data);
// });



      const doesCourseExists = await Course.findById( req.body.course_id );


      if (doesCourseExists) {
        for(const x in req.body){
       
       if(x === 'course_header_image')   doesCourseExists[x]=file.course_header_image[0].location
       doesCourseExists[x]=req.body[x]
      
        }

       await 
        doesCourseExists.save()


        //

        return res.status(201).json({
          messaage: "Course updated successfully",
          data: doesCourseExists,
        });
      } else {
        return res.status(400).json({
          messaage: `Course with title: ${req.body.title}, doesn’t exist`,
          data: {},
        });
      }
  
  } catch (ex) {
    return res
      .status(500)
      .json({ message: "Failed to create course", data: ex.messaage });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const rateCourse = async (req, res) => {


  try {
    const filter = {course:req.body.course_id,owner:req.user._id};
    const course = await OwnedCourse.findOne(filter);
  if(req.body.comment ){
    course.comment =  req.body.comment 
  }
    if( req.body.rating ){
      course.rating = req.body.rating 
    }
    await course.save();
    return res.json({
      message: "Loaded successfully",
      data: course,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to load the list",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const getAllCourses = async (req, res) => {
  const filter = {};
  const allCourses = await Course.find(filter);
  try {
    return res.json({
      message: "Loaded successfully",
      data: allCourses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to load the list",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const comfirmPayAndAddCourseToUser = async (req, res) => {
  try {
    //const views = await OwnedCourse.find().sort({ students : criteria}).exec(function(err, model){  });
    const course = await Course.findById(req.body.course_id);
    const user = req.user;

    if (course) {
      const newOwnedCourse = await new OwnedCourse({
        course: course,
        owner: req.user,
      });

      await newOwnedCourse.save();
      return res.status(200).json({
        message: `Course added to ${user.name}\'s course list`,
        data: newOwnedCourse,
      });
    } else {
      return res.status(400).json({
        message: `No course was found with the id: ${req.body.course_id}`,
        data: newOwnedCourse,
      });
    }
    //    //
  } catch (e) {
    return res.status(400).json({
      message: "Failed to complete task.",
      data: e.messaage,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getPopularCourses = async (req, res) => {
  const course = await Course.find({});
  var coursesStudentCount = {};
  //Get all the courses
  const allExistingCourses = await Course.find({}).sort({'count':-1}).limit(10);
  //


  try {
    return res.status(200).json({
      message: "Popular Courses list",
      data: allExistingCourses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to find free courses",
      data: e.messaage,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const getAllFreeCourses = async (req, res) => {
  try {
    const courses = await Course.find({ price: "free" }).populate(
      "facilitator"
    );
    return res.status(200).json({
      message: "Free Courses list",
      data: courses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to find free courses",
      data: e.messaage,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getUserActiveCourses = async (req, res) => {
  try {

    const courses = await OwnedCourse.find({ owner: req.user._id }).populate(
      ["course"]);

    return res.status(200).json({
      message: `All of ${req.user.name} active courses`,
      data: courses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to find active courses",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const returnCoursesObject = async (req, res) => {
  var returnVal = [];
  const courseList = req.body.courses;
  if(courseList.length > 0){
    for(var x in courseList){
      returnVal.push(await Course.findById(courseList[x]));
    }
  }
  try {
    const courses = await OwnedCourse.find({});
    return res.status(200).json({
      message: "All bought Courses list",
      data: returnVal,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to find courses",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getCoursesByName = async (req, res) => {



  var search_key = req.query.search_key
 


  const docs = await Course.find({ rank: { $regex: search_key } });



//const wow = await Course.find( { 'title' : { '$regex' : req.query.search_ke, '$options' : 'i' } } )
  // const returnVal = await Course.find({title:req.query.search_key})
  try {
   
    return res.status(200).json({
      message: "All bought Courses list",
      data: docs,
    })
  } catch (e) {
    return res.status(500).json({
      message: "Failed to find courses",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getAllBoughtCourses = async (req, res) => {
  try {
    const courses = await OwnedCourse.find({});
    return res.status(200).json({
      message: "All bought Courses list",
      data: courses,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to find courses",
      data: e.messaage,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const deleteCourse = async (req, res) => {
  try {
    const itemToDelete = req.body.course_id;

    var course = await Course.findOneAndDelete({
      _id: itemToDelete,
    }).populate("facilitator");

    await course.save();
    return res.status(200).json({
      message: "Course(s) removed.",
      data: cart,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error.",
      data: e.messaage,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
module.exports = {
  getPopularCourses,
  createCourse,
  getAllCourses,
  getAllFreeCourses,
  deleteCourse,
  comfirmPayAndAddCourseToUser,
  getUserActiveCourses,rateCourse,
  getAllBoughtCourses,getCoursesByName,
  returnCoursesObject,updateCourse
};
