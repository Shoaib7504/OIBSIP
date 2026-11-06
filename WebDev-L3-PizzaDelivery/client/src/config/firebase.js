import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Force account selection so users can switch accounts easily
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Upload a user's custom profile photo to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} userId - User identifier
 * @returns {Promise<string>} Public download URL
 */
export const uploadProfilePhoto = async (file, userId) => {
  if (!file) throw new Error("No image file provided");

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPEG, PNG, WEBP, or GIF)");
  }

  // Max 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image file size must be under 5MB");
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const safeUserId = userId ? String(userId) : "anonymous";
  const storageRef = ref(storage, `profile_photos/${safeUserId}_${Date.now()}.${fileExt}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return await getDownloadURL(snapshot.ref);
};

export default app;
