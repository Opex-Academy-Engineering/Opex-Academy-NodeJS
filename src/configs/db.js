// Requiring firebase (as our db)
const { initializeApp } = require("firebase/app");
// Importing our configuration to initialize our app
const config = require('./firebase');
// Creates and initializes a Firebase app instance. Pass options as param
const db = initializeApp(config.firebaseConfig);
module.exports = db;