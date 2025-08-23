import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Firebase configuration for BakeStatements project
const firebaseConfig = {
  apiKey: "AIzaSyDK7oR8_jYXX2X3axgBeOWRLd1zcnOvEiw",
  authDomain: "bakestatements.firebaseapp.com",
  projectId: "bakestatements",
  storageBucket: "bakestatements.appspot.com",
  messagingSenderId: "408315510594",
  appId: "1:408315510594:web:6dbd412e04d4b0a2a612db",
  measurementId: "G-YLH8KC6Y1Y"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app