// import { initializeApp, getApps } from "firebase/app"
// import { getAuth, connectAuthEmulator } from "firebase/auth"
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics"

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// }

// // Initialize Firebase
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// // Initialize Firebase services
// export const auth = getAuth(app)
// export const db = getFirestore(app)

// // Initialize Analytics (only in browser)
// export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

// // Connect to emulators in development
// if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099")
//     connectFirestoreEmulator(db, "localhost", 8080)
//   } catch (error) {
//     console.log("Emulators already connected")
//   }
// }

// export default app




// import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app"
// import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
// import { Firestore, getFirestore } from "firebase/firestore";

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAp_SEDCab_WWIGY4n4VoYizmjfcIDg6qg",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "task-site-de515.firebaseapp.com",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "task-site-de515",
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "task-site-de515.appspot.com",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "951970015442",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:951970015442:web:a7787df79aa567ff45250b",
// }

// // Validate config
// const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
// const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

// if (missingKeys.length > 0) {
//    console.error("⚠️ Missing Firebase config keys:", missingKeys);
// }

// // Initialize Firebase app (only once)
// let app
// let auth
// let db
// let googleProvider

// try {
//   // Initialize Firebase app
//   app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

//   // Initialize services
//   auth = getAuth(app)
//   db = getFirestore(app)

//   // Initialize Google Auth Provider
//   googleProvider = new GoogleAuthProvider()
//   googleProvider.setCustomParameters({
//     prompt: "select_account",
//   })

//   console.log("Firebase initialized successfully")
// } catch (error) {
//   console.error("Firebase initialization error:", error)

//   // Create fallback objects to prevent crashes
//   auth = null
//   db = null
//   googleProvider = new GoogleAuthProvider()
// }

// export { app, auth, db, googleProvider }
// export default app;



















// lib/firebase.ts
import { FirebaseApp, initializeApp, getApps, getApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// ——— 1) Your Firebase config —————
const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY     || "AIzaSyAp_SEDCab_WWIGY4n4VoYizmjfcIDg6qg",
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "task-site-de515.firebaseapp.com",
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID  || "task-site-de515",
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     || "task-site-de515.appspot.com",
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "951970015442",
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID   || "1:951970015442:web:a7787df79aa567ff45250b",
};

// ——— 2) Initialize (or re-use) your Firebase app immediately —————
const app: FirebaseApp = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// ——— 3) Initialize your services with explicit types —————
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ——— 4) Ready to go! —————
console.log("✅ Firebase initialized");

export default app;

