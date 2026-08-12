
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-d88a3.firebaseapp.com",
  projectId: "interviewiq-d88a3",
  storageBucket: "interviewiq-d88a3.firebasestorage.app",
  messagingSenderId: "725128634449",
  appId: "1:725128634449:web:5bea12dd0d392f0a03d870"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}