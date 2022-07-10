const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const User = require("../../models/user");
const Facilitator = require("../../models/facilitator");
const OwnedCourse = require("../../models/ownedCourse");
const Course = require("../../models/course");
const authAdmin = require("../../api/middleware/authAdmin");
const jwt = require("jsonwebtoken");
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

//

const createCourse = async (req, res) => {
  try {
    // const token = req.header("Authorization").replace("Bearer ", "");
    // const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const facilitator = await Facilitator.findById("62c4dcb20e463638cd1da4e6");

    if (facilitator) {
      const doesCourseExists = await Course.findOne({ title: req.body.title });
      if (!doesCourseExists) {
        const course = new Course({
          title: req.body.title,
          description: req.body.description,
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
      console.log(req.user);

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
  const course = await Course.find({ price: "free" }).populate("facilitator");

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
const getAllBoughtCourses = async (req, res) => {
  try {
    const courses = await OwnedCourse.find({}).populate("facilitator");
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
};
