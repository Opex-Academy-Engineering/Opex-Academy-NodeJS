const createCourse = async (req, res) => {
  form.parse(req, async (err, fields, files) => {
    console.log({ fields });
    try {
      const verify = jwt.verify(
        req.token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            res
              .status(400)
              .json({ message: "Failed to add course to cart", data: err });
          }
        }
      );
      console.log(req.user);
      const user = req.user;

      const course = new Course({
        ...fields,
        tutor: user,
      });
      await course.save();

      //

      res.status(201).json({
        messaage: "Course added successfully to cart.",
        data: course,
      });
    } catch (e) {
      res
        .status(400)
        .json({ message: "Failed to add course to cart", data: e });
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

        res.json({
            "message":"Loaded successfully",
            "data":allCourses})
    } catch (e) {
        res.status(500).json({
            "message":"Failed to load the list",
            "data":{}})
    }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

const getAllFreeCourses = async (req, res) => {
    const course = await Course.find({price:"free"});

    try {
      

    
             res.status(200).json({
                "message":"Free Courses list",
                "data":course
             })
        


    } catch (e) {
        res.status(500).json({
            "message":"Failed to find free courses",
            "data":course
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
      res.status(200).json({
        message: "Course(s) removed.",
        data: cart,
      });
    } catch (e) {
      res.status(500).json({
        message: "Server error.",
        data: e,
      });
    }
  }

module.exports = { createCourse,getAllCourses,getAllFreeCourses,deleteCourse };
