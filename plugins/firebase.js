// plugins/firebase.js - Corrected for Firebase v9+ modular SDK AND Nuxt 2 syntax
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration using environment variables
// Make sure NUXT_ENV_ prefixes are used in your .env file
const firebaseConfig = {
  apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NUXT_ENV_FIREBASE_APP_ID,
  // measurementId: process.env.NUXT_ENV_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase if it hasn't been initialized yet
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('Firebase Initialized'); // Log for debugging
} else {
  firebaseApp = getApp(); // Get the existing app
  console.log('Firebase App already exists'); // Log for debugging
}

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Nuxt 2 Plugin syntax: Export a function that receives context and inject helper
export default (context, inject) => {
  // Inject Firebase services into Nuxt context (, , )
  // and Vue instances (this., this., this.)
  inject('firebaseApp', firebaseApp);
  inject('auth', auth);
  inject('db', db);
}
