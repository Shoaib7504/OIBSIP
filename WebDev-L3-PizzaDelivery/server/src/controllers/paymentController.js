
import Order from "../models/Order.js";
import stripe from "../config/stripe.js";
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

    if (order.paymentStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This order is not eligible for payment",
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

    // 1. Reuse an existing Checkout Session if possible
    if (order.stripeCheckoutSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        order.stripeCheckoutSessionId
      );

      // Reuse an open session instead of creating a duplicate
      if (existingSession.status === "open") {
        return res.status(200).json({
          success: true,
          message: "Existing Stripe Checkout Session reused",
          data: {
            sessionId: existingSession.id,
            checkoutUrl: existingSession.url,
          },
        });
      }

      // A completed session must be verified through the webhook
      if (existingSession.status === "complete") {
        return res.status(409).json({
          success: false,
          message: "Checkout is complete. Payment confirmation is pending.",
        });
      }

      // If expired, continue and create a new session
    }

    // 2. Create a new Checkout Session
    const session = await createStripeCheckoutSession({
      order,
      successUrl: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.CLIENT_URL}/payment/cancel?orderId=${order._id}`,
    });

    // 3. Save the new Checkout Session ID
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
