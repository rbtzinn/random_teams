// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM6DePlmPfKtfnEmH_CGk0sVVNB7LW07A",
  authDomain: "randomsteams-b7531.firebaseapp.com",
  projectId: "randomsteams-b7531",
  storageBucket: "randomsteams-b7531.firebasestorage.app",
  messagingSenderId: "418357052172",
  appId: "1:418357052172:web:1f17de38f3d5dade927f29",
  measurementId: "G-TW2S97LCYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app)