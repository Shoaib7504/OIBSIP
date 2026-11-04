import api from "./api";

/**
 * Request a Stripe Checkout Session for a specific order.
 * @param {string} orderId - MongoDB ObjectId of the Order
 * @returns {Promise<Object>} Response containing checkoutUrl and sessionId
 */
export const createCheckoutSession = async (orderId) => {
  const response = await api.post(`/api/payments/create-checkout-session/${orderId}`);
  return response.data;
};

/**
 * Get payment and order status by Stripe Checkout Session ID.
 * @param {string} sessionId - Stripe Checkout Session ID
 * @returns {Promise<Object>} Response containing paymentStatus, orderId, etc.
 */
export const getSessionStatus = async (sessionId) => {
  const response = await api.get(`/api/payments/session-status/${sessionId}`);
  return response.data;
};
