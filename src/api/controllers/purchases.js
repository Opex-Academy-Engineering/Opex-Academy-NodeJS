
const OwnedCourse = require('../../models/ownedCourse')


const confirmPurchase= async (req,res)=>{
    try {
        const purchase = new OwnedCourse   ({
course: '6323319cceec8bdf07c40591',
owner:'62b1a5766d59afcc00b50362',
    });

purchase.save();

      }catch (ex){

      }
}
const getPurchases = async (req, res) => {
  try {
    confirmPurchase();
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