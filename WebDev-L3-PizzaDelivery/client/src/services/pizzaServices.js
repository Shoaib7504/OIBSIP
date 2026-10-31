import api from "./api";

// Get all pizzas from backend
export const getAllPizzas = async () => {
  const response = await api.get("/api/pizzas");
  return response.data;
};

// Get single pizza by id
export const getPizzaById = async (id) => {
  const response = await api.get(`/api/pizzas/${id}`);
  return response.data;
};
