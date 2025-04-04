import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6aXsHh7lGuvOS6MEX8ZyMKimvhV1prG0",
  authDomain: "nashatechrecipe.firebaseapp.com",
  projectId: "nashatechrecipe",
  storageBucket: "nashatechrecipe.firebasestorage.app",
  messagingSenderId: "24843706792",
  appId: "1:24843706792:web:4943c1bd6225d7a953bd9d",
  measurementId: "G-BN9NRBBEJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const fbProvider = new FacebookAuthProvider();

export { auth, firestore, fbProvider, analytics };
export default app;
