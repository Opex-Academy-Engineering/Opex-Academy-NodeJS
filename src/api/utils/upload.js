//Intended to use as a middleware

const aws  = require('aws-sdk')
const multer  = require('multer')
const multerS3  = require('multer-s3')

const endpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT)

const s3 = new aws.S3({           
    endpoint: endpoint,
    accessKeyId:process.env.DO_SPACES_KEY,
    secretAccessKey:process.env.SDO_SPACES_SECRET,
   
  });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'opex',
    acl: 'public-read',
    
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString()+file.originalname.substring(file.originalname.length - 15,file.originalname.length))
    }
  })
})

module.exports = upload;