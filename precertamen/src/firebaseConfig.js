// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmkIan2bVVutldWYIc9c4SdaMb4aHR214",
  authDomain: "precertamen2-810bd.firebaseapp.com",
  projectId: "precertamen2-810bd",
  storageBucket: "precertamen2-810bd.firebasestorage.app",
  messagingSenderId: "5347007092",
  appId: "1:5347007092:web:7f711abb1cbc23dd680f21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);