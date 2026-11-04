import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";


export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return res.status(400).json({
            success: false,
            message: "Missing Stripe webhook signature or secret",
        });
    }

    let event;

    // 1. Verify Stripe webhook signature
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error.message);

        return res.status(400).json({
            success: false,
            message: "Invalid Stripe webhook signature",
        });
    }

    // 2. Handle successful Checkout Session
    if (event.type !== "checkout.session.completed") {
        return res.status(200).json({
            received: true,
            message: "Event received but not handled",
        });
    }

    try {
        const session = event.data.object;

        // 3. Confirm payment is actually successful
        if (session.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message: "Stripe payment is not completed",
            });
        }

        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (
            !orderId ||
            !userId ||
            session.client_reference_id !== orderId
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order reference in Stripe session",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(orderId) ||
            !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order or user ID",
            });
        }
        // 4. Find the matching order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 5. Verify order ownership and payment configuration
        if (
            order.user?.toString() !== userId ||
            order.paymentMethod !== "Stripe" ||
            order.currency !== "USD" ||
            order.stripeCheckoutSessionId !== session.id
        ) {
            return res.status(400).json({
                success: false,
                message: "Stripe session does not match the order",
            });
        }

        // 6. Verify currency and amount
        const expectedAmount = Math.round(order.totalAmount * 100);

        if (
            session.currency !== "usd" ||
            session.amount_total !== expectedAmount
        ) {
            return res.status(400).json({
                success: false,
                message: "Stripe payment amount or currency mismatch",
            });
        }

        // 7. Handle duplicate webhook delivery
        if (order.paymentStatus === "Completed") {
            return res.status(200).json({
                received: true,
                message: "Payment was already processed",
            });
        }

        if (order.paymentStatus !== "Pending" || order.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is not eligible for payment confirmation",
            });
        }

        // 8. Atomically mark payment as completed
        const updatedOrder = await Order.findOneAndUpdate(
            {
                _id: order._id,
                paymentStatus: "Pending",
                status: { $ne: "Cancelled" },
                stripeCheckoutSessionId: session.id,
            },
            {
                $set: {
                    paymentStatus: "Completed",
                    stripePaymentIntentId:
                        typeof session.payment_intent === "string"
                            ? session.payment_intent
                            : session.payment_intent?.id || null,
                    paidAt: new Date(),
                },
            },
            { new: true }
        );

        if (!updatedOrder) {
            // Another webhook request may have processed this payment.
            const latestOrder = await Order.findById(order._id);

            if (
                latestOrder?.paymentStatus === "Completed" &&
                latestOrder.stripeCheckoutSessionId === session.id
            ) {
                return res.status(200).json({
                    received: true,
                    message: "Payment was already processed",
                });
            }

            return res.status(409).json({
                success: false,
                message: "Could not confirm order payment",
            });
        }

        console.log(`Stripe payment completed for order: ${order._id}`);

        return res.status(200).json({
            received: true,
            message: "Payment confirmed successfully",
        });
    } catch (error) {
        console.error("Stripe webhook processing error:", error);

        // A 500 response allows Stripe to retry the webhook.
        return res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
};