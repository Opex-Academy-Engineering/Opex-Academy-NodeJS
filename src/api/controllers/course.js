const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Course = require("../../models/course");
const User = require("../../models/user");
const OwnedCourse = require("../../models/ownedCourse");
const jwt = require("jsonwebtoken");
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

//

const createCourse = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: payload._id });

    const course = new Course({
      title: req.body.title,
      description: req.body.course_outline,
      tutor: user,
    });

    await course.save();

    //
    return res.status(201).json({
      messaage: "Course added successfully to cart.",
      data: course,
    });
  } catch (ex) {
    return res
      .status(500)
      .json({ message: "Failed to add course to cart", data: ex.messaage });
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
      })
      console.log(req.user)

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

  try {
    return res.status(200).json({
      message: "Free Courses list",
      data: course,
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
    const courses = await Course.find({ price: "free" });
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
    const courses = await OwnedCourse.find({ owner: req.user._id });
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
const getAllBoughtCourses = async (req, res) => {
  try {
    const courses = await OwnedCourse.find({});
    return res.status(200).json({
      message: 'All bought Courses list',
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
    });

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
  getAllBoughtCourses
};
