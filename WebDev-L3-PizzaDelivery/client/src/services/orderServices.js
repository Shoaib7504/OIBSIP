import api from "./api";

// Create a new order in backend MongoDB
export const createOrder = async (orderData) => {
  const response = await api.post("/api/orders", orderData);
  return response.data;
};

// Get all orders (with optional status or customer email filter)
export const getAllOrders = async (params = {}) => {
  const response = await api.get("/api/orders", { params });
  return response.data;
};

// Get single order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`/api/orders/${id}`);
  return response.data;
};

// Update order status (Admin)
export const updateOrderStatus = async (id, status, paymentStatus) => {
  const payload = { status };
  if (paymentStatus) {
    payload.paymentStatus = paymentStatus;
  }
  const response = await api.patch(`/api/orders/${id}/status`, payload);
  return response.data;
};

// Get current logged-in user's orders
export const getMyOrders = async () => {
  const response = await api.get("/api/orders/my-orders");
  return response.data;
};