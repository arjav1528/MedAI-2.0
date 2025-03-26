// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup as firebaseSignInWithPopup,
  User as FirebaseUser, 
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Explicitly define the Firebase config to avoid potential issues with env variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Log config to verify env variables are loaded (remove in production)
console.log("Firebase config keys present:", Object.keys(firebaseConfig).filter(key => 
  firebaseConfig[key as keyof typeof firebaseConfig] !== undefined
).length);

// Improved initialization with better error handling
let app: FirebaseApp;

try {
  if (!getApps().length) {
    console.log("Initializing Firebase app...");
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully");
  } else {
    app = getApps()[0];
    console.log("Using existing Firebase app");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase. Check your configuration.");
}

// Initialize Firebase services with proper typing
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Configure provider for better UX
provider.setCustomParameters({
  prompt: 'select_account'
});

// Enhanced signInWithPopup function
const signInWithPopup = async (auth: any, provider: any) => {
  try {
    console.log("Attempting to sign in with popup...");
    // Force a clean authentication attempt
    const result = await firebaseSignInWithPopup(auth, provider);
    console.log("Sign in successful:", result.user?.uid);
    return result;
  } catch (error: any) {
    console.error("Sign in with popup failed:", error.code, error.message);
    if (error.code === 'auth/popup-blocked') {
      console.error("Popup was blocked by the browser. Please allow popups for this site.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.error("Popup was closed by the user before completing the sign in process.");
    } else if (error.code === 'auth/cancelled-popup-request') {
      console.error("Multiple popup requests were triggered. Only the latest will be processed.");
    } else if (error.code === 'auth/network-request-failed') {
      console.error("Network error occurred during authentication.");
    }
    throw error;
  }
};

export { auth, db, provider, signInWithPopup };
  export type { FirebaseUser };
export default app;
