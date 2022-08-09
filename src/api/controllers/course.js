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
    const file = req.files.course_header_image;

    const uid = uuidv4();
    const firebaseApp = getApp();
    const storage = getStorage(
      firebaseApp,
      "gs://opex-academy-mobile.appspot.com"
    );



    //
    const imagesRef = ref(storage, `images/${uid}`);

    //  let byteArray =  fs.readFileSync(file[0].path);
 
    const trial = await uploadBytes(imagesRef, file[0]);
   

    const uploadedDataUrl = await getDownloadURL(imagesRef, img).then(result=>{
      console.log(result)
    });
    // const deleteData = fs.unlinkSync(filePath);
    const facilitator = await Facilitator.findOne({
      facilitator_id: req.body.facilitator_id,
    });



    if (facilitator) {
      const doesCourseExists = await Course.findOne({ title: req.body.title });
      if (!doesCourseExists) {
        const course = new Course({
          title: req.body.title,
          description: req.body.description,
          course_header_image: "uploadedDataUrl",
          facilitator: facilitator,
        });

        course.save();
        //
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
      .json({ message: "Failed to create course", data: ex.messaage });
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
  const course = await Course.find({ price: "free" });
  var coursesStudentCount = {};
  //Get all the courses
  const allExistingCourses = await Course.find({});
  //Add every new Id to a list 
  if(allExistingCourses){
    for(var x in allExistingCourses){
      var count = await OwnedCourse.find({course: allExistingCourses[x]});

if(count){
  coursesStudentCount[ allExistingCourses[x]._id] = count.length;
}
    }
  }

  try {
    return res.status(200).json({
      message: "Free Courses list",
      data: coursesStudentCount,
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
      "facilitator"
    );
    return res.status(200).json({
      message: `All of ${req.user.name} Courses list`,
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
  getUserActiveCourses,
  getAllBoughtCourses,
  returnCoursesObject
};
