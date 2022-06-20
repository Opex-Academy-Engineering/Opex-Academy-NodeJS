// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCv8ZSO2qEuuUfS05dnvcxWg-hd62bZMmM",
  authDomain: "opex-academy-mobile.firebaseapp.com",
  projectId: "opex-academy-mobile",
  storageBucket: "opex-academy-mobile.appspot.com",
  messagingSenderId: "946184714221",
  appId: "1:946184714221:web:44ee3bda304b4fc2a519e4",
  measurementId: "G-FF4B6F03C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

module.exports = {
    firebaseConfig
}