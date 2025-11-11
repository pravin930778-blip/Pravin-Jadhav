// Fix: Use Firebase v9 compat libraries to match v8 syntax.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// IMPORTANT: Replace this with your own Firebase project configuration.
// You can find this in your Firebase project console:
// Project settings > General > Your apps > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "AIzaSyASxfEAmNX036kXzLMx4vCgZ2SShjZtVOc",
  authDomain: "athlos-fitness.firebaseapp.com",
  databaseURL: "https://athlos-fitness-default-rtdb.firebaseio.com",
  projectId: "athlos-fitness",
  storageBucket: "athlos-fitness.firebasestorage.app",
  messagingSenderId: "441672999167",
  appId: "1:441672999167:web:b5149212b1e3af78e22cca",
  measurementId: "G-84677WGNDS"
};

// Initialize Firebase
// Fix: Use compat initialization
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Initialize and export Firebase services
// Fix: Use compat services
export const auth = firebase.auth();
export const db = firebase.firestore();