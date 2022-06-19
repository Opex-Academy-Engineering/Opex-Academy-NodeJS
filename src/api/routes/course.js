const express = require('express')
const auth = require('../middleware/auth.js')
const jwt = require('jsonwebtoken')
const Course = require('../../models/course')
const router = new express.Router()

const formidable = require('formidable');
const form = formidable({ multiples: true });

require("dotenv").config();

// Create a task
router.post('/course', auth, async (req, res) => {
    form.parse(req, async (err, fields, files) =>  {
        console.log({fields})
    try {
        const verify = jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET,function (err,decoded){
            if(err){
                res.status(400).json({"message":"Failed to add course to cart",
                "data":err
            })}
             });
             console.log(req.user)
const user = req.user;

        const course = new Course({
...fields,tutor:user
        });
await course.save();
                               
        //
        
        res.status(201).json({
            "messaage":"Course added successfully to cart.",
            "data":course
        })
    } catch (e) {
        res.status(400).json({"message":"Failed to add course to cart",
        "data":e
    }
        )

}
});
});

// Read/list all tasks
router.get('/courses', auth, async (req, res) => {
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
})

// Read/list a particular task
router.get('/course/free', auth, async (req, res) => {
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
})

// Update a task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})





router.delete("/course", auth, async (req, res) => {

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
  });





module.exports = router