import stripe from "../config/stripe.js";

export const createStripeCheckoutSession = async ({
  order,
  successUrl,
  cancelUrl,
}) => {
  if (!order?._id || !order?.totalAmount || order.totalAmount <= 0) {
    throw new Error("Invalid order or payment amount");
  }

  // Convert USD to cents (e.g. $12.50 = 1250 cents)
  const amountInCents = Math.round(order.totalAmount * 100);

  if (!Number.isSafeInteger(amountInCents) || amountInCents <= 0) {
    throw new Error("Invalid payment amount");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "PizzaCrave Order",
            description: `Order #${order._id}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    client_reference_id: order._id.toString(),
    metadata: {
      orderId: order._id.toString(),
      userId: order.user.toString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
};
