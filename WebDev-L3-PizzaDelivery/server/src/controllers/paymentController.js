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

      // A completed session must be verified through the webhook or session status
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

export const getSessionStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Find order by Stripe Checkout Session ID
    const order = await Order.findOne({
      stripeCheckoutSessionId: sessionId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this checkout session",
      });
    }

    // Authorization check if user is authenticated: owner, admin, or matching email
    if (req.user) {
      const isOwner =
        order.user && req.user && order.user.toString() === req.user._id.toString();
      const isAdmin = req.user?.role === "admin";
      const isMatchingEmail =
        order.customer?.email &&
        req.user?.email &&
        order.customer.email.toLowerCase() === req.user.email.toLowerCase();

      if (!isOwner && !isAdmin && !isMatchingEmail) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to view payment status for this session",
        });
      }
    }

    // Resilient fallback: If still Pending, verify payment directly with Stripe
    if (order.paymentStatus === "Pending") {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        const expectedAmount = Math.round(order.totalAmount * 100);

        if (
          stripeSession.payment_status === "paid" &&
          stripeSession.currency === "usd" &&
          stripeSession.amount_total === expectedAmount
        ) {
          order.paymentStatus = "Completed";
          order.stripePaymentIntentId =
            typeof stripeSession.payment_intent === "string"
              ? stripeSession.payment_intent
              : stripeSession.payment_intent?.id || null;
          order.paidAt = new Date();
          await order.save();
          console.log(`Stripe payment verified via session retrieval for order: ${order._id}`);
        }
      } catch (stripeErr) {
        console.warn("Could not retrieve session from Stripe:", stripeErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
