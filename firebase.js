// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMK9tBOrxSiNpqZ6tIBSszqa5qu9luZwo",
  authDomain: "inventory-tracker-3ed7a.firebaseapp.com",
  projectId: "inventory-tracker-3ed7a",
  storageBucket: "inventory-tracker-3ed7a.appspot.com",
  messagingSenderId: "57517556906",
  appId: "1:57517556906:web:1bb61b96422a7713fd7cd3",
  measurementId: "G-31Q7L3CCDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage }

