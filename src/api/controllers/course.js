const formidable = require("formidable");
const form = formidable({ multiples: true });
const Course = require('../../models/course')

const createCourse = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    console.log({ fields });
    try {
      const user = req.user;
      //
      //

      const course = new Course({
        ...fields,
        tutor: user,
        tags: {
            first_tag:fields.first_tag ?? null,
            second_tag: fields.second_tag ?? null
        }
      });
      await course.save();

      //

       return res.status(201).json({
        "messaage": "Course added successfully to cart.",
        "data": course,
      });
    } catch (e) {
      return res
        .status(500)
        .json({ "message": "Failed to add course to cart", "data": e.messaage });
    }
  });
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const getAllCourses = async (req, res) => {
    const filter = {};
    const allCourses = await Course.find(filter);
    try {

      return res.json({
            "message":"Loaded successfully",
            "data":allCourses})
    } catch (e) {
      return res.status(500).json({
            "message":"Failed to load the list",
            "data":e.messaage})
    }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const getAllFreeCourses = async (req, res) => {
    const course = await Course.find({price:"free"});

    try {
      

    
      return res.status(200).json({
                "message":"Free Courses list",
                "data":course
             })
        


    } catch (e) {
      return res.status(500).json({
            "message":"Failed to find free courses",
            "data":e.messaage
         })
    }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */


const deleteCourse = async (req, res) => {

    try {
    
      const itemToDelete = req.body.course_id;
  
      var course = await Course.findOneAndDelete({
          _id: itemToDelete
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
  }

module.exports = { createCourse,getAllCourses,getAllFreeCourses,deleteCourse };
