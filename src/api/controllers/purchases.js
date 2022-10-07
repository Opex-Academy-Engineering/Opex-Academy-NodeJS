const Course = require("../../models/course");
const OwnedCourse = require("../../models/ownedCourse");

const confirmPurchase = async (req, res) => {
  try {
    doesCourseExist = await Course.findById(req.body.course);

    const allUserCourses = await OwnedCourse.find({ owner: req.user._id });
    for (var x in allUserCourses) {
      req.user.courses.push(allUserCourses[x].course);
    }

    const state = req.user.courses.includes(doesCourseExist._id);
    if (doesCourseExist && state != true) {
      const purchase = new OwnedCourse({
        course: req.body.course,
        owner: req.user._id,
      });
req.user.save();
      purchase.save();
      doesCourseExist.count = doesCourseExist.count + 1;
      doesCourseExist.save();
      return res.status(200).json({
        message: "Course added to user",
        data: purchase,
      });
    } else {
      return res.status(400).json({
        message: "Course doesn't exist or it's already in your courses",
        data: doesCourseExist,
      });
    }
  } catch (ex) {
    return res.status(500).json({
      message: "Server error",
      data: ex.message,
    });
  }
};
const getPurchases = async (req, res) => {
  try {
    confirmPurchase();
    const ownedCourse = await OwnedCourse.find({}).populate([
      "course",
      "owner",
    ]);

    return res.status(200).json({
      message: "All purchased courses",
      data: ownedCourse,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error",
      data: e.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
module.exports = { getPurchases, confirmPurchase };
