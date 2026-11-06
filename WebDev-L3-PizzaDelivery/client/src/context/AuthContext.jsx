import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile, googleLoginUser } from "../services/authServices";
import { signInWithGoogle } from "../config/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Restore and verify the login session
  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await getUserProfile();
        if (!response.success || !response.data) {
          throw new Error("Unable to restore session");
        }
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  // Save authentication data after login or register
  const setAuth = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  // Sign in or register with Google via Firebase
  const loginWithGoogle = async () => {
    const firebaseUser = await signInWithGoogle();
    const idToken = await firebaseUser.getIdToken();

    // Extract displayName and photoURL with fallback to providerData
    const displayName =
      firebaseUser.displayName ||
      firebaseUser.providerData?.[0]?.displayName ||
      "";
    const photoURL =
      firebaseUser.photoURL ||
      firebaseUser.providerData?.[0]?.photoURL ||
      "";

    const response = await googleLoginUser({
      name: displayName,
      email: firebaseUser.email,
      googleId: firebaseUser.uid,
      photoURL,
      idToken,
    });

    if (!response.success || !response.token || !response.data) {
      throw new Error(response.message || "Google authentication failed");
    }

    setAuth(response.data, response.token);
    return response.data;
  };

  // Update current user profile in state and localStorage
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === "admin",
    setAuth,
    updateUser,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
