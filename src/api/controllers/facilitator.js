

const { v4: uuidv4 } = require("uuid");

const Facilitator = require('../../models/facilitator')

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
    const firebaseApp = getApp();
    const storage = getStorage(
      firebaseApp,
      "gs://opex-academy-mobile.appspot.com"
    );

    const file = req.file;
    var img = require("fs").readFileSync(file.path);

    const uid = uuidv4();
    //
    const imagesRef = ref(storage, `images/${uid}.jpg`);

    await uploadBytes(imagesRef, img);
    const profilePicurl = await getDownloadURL(imagesRef, img);

    const isEmailAvailable = await Facilitator.findOne({
      email: req.body.email,
    });

    if (!isEmailAvailable) {
      const facilitator = new Facilitator({ ...req.body });
      facilitator.profile_pic = profilePicurl;

      const last = await Facilitator.find({})

     if(last.length>0){
        facilitator.facilitator_id = padNumber(last.length.toString());
        
     }else{
        facilitator.facilitator_id = 'FAC00';
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

  try{
    const facilitator = await Facilitator.findOneAndDelete({facilitator_id:req.body.facilitator_id});
    if(facilitator){
        return res.status(200).json({
            message: "Facilitator deleted successfully",
            data: facilitator,
          });
    }else{
        return res.status(400).json({
            message: "Couldnt find the facilitator with that _id",
            data: {}
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
  deleteFacilitators
};
