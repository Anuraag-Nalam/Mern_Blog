// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-c1d52.firebaseapp.com",
    projectId: "mern-blog-c1d52",
    storageBucket: "mern-blog-c1d52.firebasestorage.app",
    messagingSenderId: "629628292354",
    appId: "1:629628292354:web:a1de2c1698c37a2be6c61b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);