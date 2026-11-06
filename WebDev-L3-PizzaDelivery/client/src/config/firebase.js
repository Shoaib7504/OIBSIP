import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIk1pL579LcQ3vH7ZpN9I5ZjKCQCDWjgs",
  authDomain: "pizzacrave-b9765.firebaseapp.com",
  projectId: "pizzacrave-b9765",
  storageBucket: "pizzacrave-b9765.firebasestorage.app",
  messagingSenderId: "776245041410",
  appId: "1:776245041410:web:342da436f2c005a3ca0a1b",
  measurementId: "G-2PYWZTE565",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Force account selection so users can switch accounts easily
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export default app;
