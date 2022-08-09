const { v4: uuidv4 } = require("uuid");

const Facilitator = require("../../models/facilitator");

const { getApp } = require("firebase/app");
//Leave this unused import
//it initializes the firebase app
const { app } = require("../../configs/firebase");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
function padNumber(number) {
  number = number.toString();

  while (number.length < 4) {
    number = "FAC00" + number;
  }

  return number;
}
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const registerNewFacilitator = async (req, res, next) => {
  try {
    //


    const isEmailAvailable = await Facilitator.findOne({
      email: req.body.email,
    });

    if (!isEmailAvailable) {
      const facilitator = new Facilitator({ ...req.body });
      facilitator.profile_pic = 'profilePicurl';

      const last = await Facilitator.find({});

      if (last.length > 0) {
        facilitator.facilitator_id = padNumber(last.length.toString());
      } else {
        facilitator.facilitator_id = "FAC00";
      }

      await facilitator.save();

      // Sends the user and the generated token only

      return res.status(201).json({
        message: "Facilitator created successfully",
        data: {
          facilitator: facilitator,
        },
      });
    } else {
      return res.status(400).json({
        message: "A facilitator with this email already exist.",
        data: {},
      });
    }
  } catch (e) {
    return res.status(400).json({
      message: "Failed to create facilitator",
      data: e.message,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const updateFacilitator = async (req, res, next) => {
  
  try {
    const isFacilitatorsListRetrieved = await Facilitator.findOneAndUpdate({facilitator_id:req.body.facilitator_id}, req.body, {upsert: true}, function(err, doc) {
      if (err) 
      return res.send(500, {error: err});

         return res.status(202).json({
        message: `Facilitator ${isFacilitatorsListRetrieved.name} updated`,
        data: isFacilitatorsListRetrieved,
      });
  });

    if (isFacilitatorsListRetrieved) {
      await isFacilitatorsListRetrieved.save();
      return res.status(202).json({
        message: `Facilitator ${isFacilitatorsListRetrieved.name} updated`,
        data: isFacilitatorsListRetrieved,
      });
    } else {
      return res.status(204).json({
        message: "Facilitator not found",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred ",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getFacilitatorInfo = async (req, res, next) => {
  try {

    const isFacilitatorsListRetrieved = await Facilitator.findOne({
      facilitator_id:req.query.facilitator_id}
    );
 
    
    if (isFacilitatorsListRetrieved) {

      return res.status(200).json({
        message: isFacilitatorsListRetrieved.name,
        data: isFacilitatorsListRetrieved,
      });
    } else {
      return res.status(204).json({
        message: "Facilitator not found",
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred ",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const toggleFacilitatorStatus = async (req, res, next) => {
  try {
    const isFacilitatorsListRetrieved = await Facilitator.findOne({
      facilitator_id:req.body.facilitator_id}
    )
 
    
    if (isFacilitatorsListRetrieved) {
      if(isFacilitatorsListRetrieved.status == 'ACTIVE'){
        isFacilitatorsListRetrieved.status = 'INACTIVE';
      }else{
        isFacilitatorsListRetrieved.status = 'ACTIVE';
      }
      await isFacilitatorsListRetrieved.save();
      return res.status(200).json({
        message: "All the facilitators.",
        data: isFacilitatorsListRetrieved,
      });
    } else {
      return res.status(204).json({
        message: "Facilitator not found",
        data: isFacilitatorsListRetrieved,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred ",
      data: error.message,
    });
  }
};
/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const getAllFacilitators = async (req, res, next) => {
  const isFacilitatorsListRetrieved = await Facilitator.find({});
  return res.status(200).json({
    message: "All the facilitators.",
    data: isFacilitatorsListRetrieved,
  });
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
const deleteFacilitators = async (req, res, next) => {
  try {
    const facilitator = await Facilitator.findOneAndDelete({
      facilitator_id: req.body.facilitator_id,
    });
    if (facilitator) {
      return res.status(200).json({
        message: "Facilitator deleted successfully",
        data: facilitator,
      });
    } else {
      return res.status(400).json({
        message: "Couldnt find the facilitator with that _id",
        data: {},
      });
    }
  } catch (e) {
    return res.status(400).json({
      message: "Failed",
      data: last,
    });
  }
};

/*
 *  -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR -- -- METHOD SEPERATOR --
 */
module.exports = {
  registerNewFacilitator,
  getAllFacilitators,
  deleteFacilitators,
  toggleFacilitatorStatus,
  getFacilitatorInfo,
  updateFacilitator
};
