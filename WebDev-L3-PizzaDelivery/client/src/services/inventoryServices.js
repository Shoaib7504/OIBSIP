import api from "./api";

// Get all inventory items from MongoDB
export const getAllInventory = async () => {
  const response = await api.get("/api/inventory");
  return response.data;
};

// Update inventory stock or threshold
export const updateInventory = async (id, updates) => {
  const response = await api.patch(`/api/inventory/${id}`, updates);
  return response.data;
};

// Alias for backward compatibility
export const updateInventoryItem = updateInventory;
