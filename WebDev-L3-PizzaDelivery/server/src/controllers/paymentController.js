
import Order from "../models/Order.js";
import { createStripeCheckoutSession } from "../services/stripeService.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find only the logged-in user's order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentMethod !== "Stripe") {
      return res.status(400).json({
        success: false,
        message: "This order is not configured for Stripe payment",
      });
    }

    if (order.paymentStatus === "Completed") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot pay for a cancelled order",
      });
    }

    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is not configured");
    }

    const session = await createStripeCheckoutSession({
      order,
      successUrl: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.CLIENT_URL}/payment/cancel?orderId=${order._id}`,
    });

    // Save Stripe Checkout Session ID
    order.stripeCheckoutSessionId = session.id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Stripe Checkout Session created successfully",
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};
