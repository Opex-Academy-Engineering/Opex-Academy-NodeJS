const express = require("express");
const router = new express.Router();
const multer = require("multer");

global.XMLHttpRequest = require("xhr2");

const { getApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  const firebaseApp = getApp();
  const storage = getStorage(
    firebaseApp,
    "gs://opex-academy-mobile.appspot.com"
  );

  // Create a child reference
  const imagesRef = ref(storage, "images.jpg");

  try {
    // Grab the ile

    const file = req.file;
    var img = require("fs").readFileSync(file.path);

    console.log(`download: ${img}`);

    uploadBytes(imagesRef, img).then((snapshot) => {
      res.send(snapshot);
      getDownloadURL(imagesRef, img).then((snapshot) => {
        console.log(`download: ${snapshot}`);
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
