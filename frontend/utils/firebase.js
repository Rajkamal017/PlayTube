// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "playtubelogin-a63ae.firebaseapp.com",
    projectId: "playtubelogin-a63ae",
    storageBucket: "playtubelogin-a63ae.firebasestorage.app",
    messagingSenderId: "363450021413",
    appId: "1:363450021413:web:692ae98d8158aa3a9c31cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}