// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKKWdIMra1VxSDUOtojk75VQ_LFgvG0m8",
  authDomain: "streetartfinder-7d4df.firebaseapp.com",
  projectId: "streetartfinder-7d4df",
  storageBucket: "streetartfinder-7d4df.firebasestorage.app",
  messagingSenderId: "132902104132",
  appId: "1:132902104132:web:269364284173ec262f6011",
};

// initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();


export { app, auth, firestore, storage, googleProvider };
