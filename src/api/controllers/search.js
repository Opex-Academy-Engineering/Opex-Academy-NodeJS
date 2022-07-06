const Course = require("../../models/course");


/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getSearchResults = async (req, res) => {
  try {
    const searchKey = req.query.search_key.toString();
    if (searchKey !== "undefined") {
      const result = await Course.fuzzySearch(searchKey);
      //   await result.save();
      res.status(200).json({
        message: `Search results for ${searchKey}`,
        data: result,
      });
    } else {
      res.status(204).json({
        message: "No content.",
        data: {},
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */

module.exports = { getSearchResults };
