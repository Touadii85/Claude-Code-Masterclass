import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  projectId: "pocket-heist-81671-723e9",
  appId: "1:594219344383:web:cdab9b637d590b783ec7ca",
  storageBucket: "pocket-heist-81671-723e9.firebasestorage.app",
  apiKey: "AIzaSyBSr-QlJhoGczJ94idXSOqjBjirCXC-ons",
  authDomain: "pocket-heist-81671-723e9.firebaseapp.com",
  messagingSenderId: "594219344383",
  measurementId: "G-1Q4GWHKHZV",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
