// const firebase = require('../../configs/db');  // reference to our db 
// require("firebase/storage"); // must be required for this to work
// const storage = firebase.storage().ref(); // create a reference to storage
// global.XMLHttpRequest = require("xhr2"); // must be used to avoid bug
// // Add Image to Storage and return the file path
// const addFile = async (file) => {
//     try {
//         // Format the filename
//         const timestamp = Date.now();
//         const name = file.originalname.split(".")[0];
//         const type = file.originalname.split(".")[1];
//         const fileName = `${name}_${timestamp}.${type}`;
//          // Step 1. Create reference for file name in cloud storage 
//         const ref = storage.child(fileName);
//         // Step 2. Upload the file in the bucket storage
//         const snapshot = await ref.put(file.buffer);
//         // Step 3. Grab the public url
//         const downloadURL = await snapshot.ref.getDownloadURL();
//         //
//         return downloadURL;
//         //
//      }  catch (error) {
//         //console.log(`The error: ${error.message}`);
//         return "";

//     }
// }
// module.exports = {
//     addFile
// }