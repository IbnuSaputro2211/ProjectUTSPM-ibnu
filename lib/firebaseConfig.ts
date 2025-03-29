// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "tugasutspm.firebaseapp.com",
  projectId: "tugasutspm",
  storageBucket: "tugasutspm.appspot.com",
  messagingSenderId: "742961126797",
  appId: "1:742961126797:web:65fcd9da751470b14e71c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inisialisasi Firestore

export { app, db };
