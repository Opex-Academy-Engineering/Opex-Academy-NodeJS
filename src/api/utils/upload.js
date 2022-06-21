//Intended to use as a middleware


const multer = require('multer'); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

module.exports = {
    upload
}