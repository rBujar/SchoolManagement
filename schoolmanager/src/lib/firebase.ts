// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-uZ8kTSYLqgDPRzTbnpfuHAQUyxF2xVk",
    authDomain: "school-22d68.firebaseapp.com",
    projectId: "school-22d68",
    storageBucket: "school-22d68.firebasestorage.app",
    messagingSenderId: "867035461952",
    appId: "1:867035461952:web:e0dde40822b146a92f22a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);