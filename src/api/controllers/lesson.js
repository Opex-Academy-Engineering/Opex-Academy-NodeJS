
const OwnedCourse = require("../../models/ownedCourse");
const Course = require("../../models/course");
const Lesson = require("../../models/lesson");



/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

//


const createLesson = async (req, res) => {
  try {        
    
    const course = await Course.findById(req.body.course_id);

    console.log(`The course: ${course}`);


    const lesson = new Lesson({
        title:req.body.title,
        description:req.body.description,
        course_id:req.body.course_id,
        thumbnail:req.files.thumbnail[0].location,
        media_upload:req.files.media_upload[0].location,
    })
    console.log(`The lesson: ${lesson}`);


    course.content.push(lesson);


    await lesson.save();
    console.log(`The course content: ${course.content}`)
    await course.save();

 
 


 console.log('we in');
        return res.status(200).json({
          messaage: "Lesson added successfully",
          data: lesson,
        });
      
  } catch (ex) {
    return res
      .status(500)
      .json({ message: "Failed to add lesson", data: ex.messaage });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const getAllLessons = async (req, res) => {
  let filter = {};

  if(req.query.course_id) filter = {course_id:req.query.course_id}
  console.log(filter)
  const allLessons = await Lesson.find(filter);
  try {
    return res.json({
      message: "Loaded successfully",
      data: allLessons,
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
  createLesson,
  getAllLessons,
  getAllFreeCourses,
  deleteCourse,
  comfirmPayAndAddCourseToUser,
  getUserActiveCourses,
  getAllBoughtCourses,
  returnCoursesObject
};
