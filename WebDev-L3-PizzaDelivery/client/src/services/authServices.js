import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/api/users/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/users/login", credentials);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/api/users/profile");
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/api/users/verify-email?token=${encodeURIComponent(token)}`);
  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post("/api/users/resend-verification", { email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/api/users/forgot-password", {
    email: email.trim().toLowerCase(),
  });

  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("/api/users/reset-password", {
    token,
    password,
  });

  return response.data;
};