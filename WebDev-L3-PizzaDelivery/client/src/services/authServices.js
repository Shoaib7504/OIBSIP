
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
