import stripe from "../config/stripe.js";

export const createStripeCheckoutSession = async ({
  order,
  successUrl,
  cancelUrl,
}) => {
  if (
    !order?._id ||
    !order?.user ||
    !order?.totalAmount ||
    order.totalAmount <= 0 ||
    order.currency !== "USD"
  ) {
    throw new Error("Invalid order or payment details");
  }

  // Convert USD to cents (e.g. $12.50 = 1250 cents)
  const amountInCents = Math.round(order.totalAmount * 100);

  if (!Number.isSafeInteger(amountInCents) || amountInCents <= 0) {
    throw new Error("Invalid payment amount");
  }

  // Same order version gets the same idempotency key.
  // Saving a new session updates order.updatedAt,
  // allowing a new key if the previous session expires.
  const idempotencyKey = `pizza-order-${order._id}-${order.stripeCheckoutSessionId || "initial"}`;

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      customer_email: order.customer?.email || undefined,
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
    },
    {
      idempotencyKey,
    }
  );

  return session;
};
