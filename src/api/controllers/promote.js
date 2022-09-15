const OwnedCourse = require('../../models/ownedCourse')

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */




const getPurchases = async (req, res) => {
  try {
    const ownedCourse = await OwnedCourse.find({})     ;
   
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
module.exports = { getPurchases }
