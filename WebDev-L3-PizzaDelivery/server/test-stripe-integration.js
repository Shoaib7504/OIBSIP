import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret_for_integration_testing_only";
}
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Order from "./src/models/Order.js";
import Pizza from "./src/models/Pizza.js";
import Inventory from "./src/models/Inventory.js";
import User from "./src/models/User.js";
import app from "./src/app.js";
import stripe from "./src/config/stripe.js";

async function runStripeTests() {
  console.log("=================================================");
  console.log("💳 STRIPE PAYMENT INTEGRATION TEST SUITE");
  console.log("=================================================\n");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB Atlas\n");

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = "") {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${testName} ${details ? `(${details})` : ""}`);
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? `(${details})` : ""}`);
    }
  }

  try {
    // 1. Setup Test User
    let testUser = await User.findOne({ email: "stripetester@example.com" });
    if (!testUser) {
      testUser = await User.create({
        name: "Stripe Tester",
        email: "stripetester@example.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz012345",
        isVerified: true,
        role: "user",
      });
    }

    const userToken = jwt.sign(
      { id: testUser._id, role: testUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Setup Admin User
    let adminUser = await User.findOne({ role: "admin" });
    const adminToken = adminUser
      ? jwt.sign({ id: adminUser._id, role: "admin" }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        })
      : userToken;

    // -------------------------------------------------------------------------
    // TEST 1: Model Schema Verification
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 1: Order Model Schema ---");
    const testOrderModel = new Order({
      customer: {
        name: "Test",
        email: "test@example.com",
        phone: "1234567890",
        address: { street: "123 St", city: "City", postalCode: "12345" },
      },
      items: [
        {
          name: "Test Pizza",
          size: "medium",
          quantity: 2,
          price: 12.99,
          stockDeducted: 2,
        },
      ],
      totalAmount: 25.98,
      paymentMethod: "Stripe",
      currency: "USD",
      stripeCheckoutSessionId: "cs_test_mock123",
      stripePaymentIntentId: "pi_test_mock123",
      paidAt: new Date(),
    });

    assert(
      testOrderModel.paymentMethod === "Stripe",
      "Order model supports paymentMethod 'Stripe'"
    );
    assert(
      testOrderModel.currency === "USD",
      "Order model currency defaults to 'USD'"
    );
    assert(
      testOrderModel.items[0].stockDeducted === 2,
      "OrderItem model persists 'stockDeducted'"
    );
    assert(
      Boolean(testOrderModel.stripeCheckoutSessionId),
      "Order model supports stripeCheckoutSessionId"
    );

    // -------------------------------------------------------------------------
    // TEST 2: Order Creation with Stripe (Pending Status & Stock Tracking)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Order Creation with Stripe ---");
    const testPizza = await Pizza.findOne();
    if (!testPizza) throw new Error("No pizzas found in DB to run tests");

    const orderPayload = {
      customer: {
        name: "Stripe Tester",
        email: "stripetester@example.com",
        phone: "+15551234567",
        address: {
          street: "777 Stripe Way",
          city: "San Francisco",
          postalCode: "94103",
        },
      },
      items: [
        {
          pizza: testPizza._id.toString(),
          name: testPizza.name,
          size: "medium",
          quantity: 2,
          price: testPizza.prices?.medium || testPizza.price,
        },
      ],
      totalAmount: (
        (testPizza.prices?.medium || testPizza.price) * 2 +
        ((testPizza.prices?.medium || testPizza.price) * 2 > 30 ? 0 : 2.99) +
        Number(
          (
            (testPizza.prices?.medium || testPizza.price) *
            2 *
            0.08
          ).toFixed(2)
        )
      ).toFixed(2),
      paymentMethod: "Stripe",
    };

    const initialStock = testPizza.stock;

    const createOrderRes = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const createOrderData = await createOrderRes.json();
    assert(
      createOrderRes.status === 201 && createOrderData.success,
      "Order created successfully with paymentMethod: 'Stripe'"
    );
    assert(
      createOrderData.data?.paymentStatus === "Pending",
      "Initial paymentStatus is strictly 'Pending'"
    );
    assert(
      createOrderData.data?.items?.[0]?.stockDeducted === 2,
      "Item stockDeducted recorded accurately in DB",
      `stockDeducted: ${createOrderData.data?.items?.[0]?.stockDeducted}`
    );

    const createdOrder = createOrderData.data;

    // -------------------------------------------------------------------------
    // TEST 3: Security - updateOrderStatus blocks paymentStatus modification
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Payment Status Security in updateOrderStatus ---");
    const tamperedUpdateRes = await fetch(
      `${baseUrl}/orders/${createdOrder._id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: "Preparing",
          paymentStatus: "Completed", // Malicious attempt to change paymentStatus
        }),
      }
    );

    const tamperedUpdateData = await tamperedUpdateRes.json();
    assert(
      tamperedUpdateRes.status === 400 &&
        tamperedUpdateData.message?.includes("Payment status cannot be updated"),
      "updateOrderStatus rejects attempts to tamper with paymentStatus"
    );

    // -------------------------------------------------------------------------
    // TEST 4: Payment Webhook Verification & Idempotency
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Webhook Processing & Idempotency ---");

    // Assign mock session ID to the order
    const mockSessionId = `cs_test_mock_${Date.now()}`;
    await Order.findByIdAndUpdate(createdOrder._id, {
      stripeCheckoutSessionId: mockSessionId,
    });

    // Generate valid signed Stripe webhook event
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const webhookPayload = {
      id: `evt_test_${Date.now()}`,
      object: "event",
      api_version: "2024-06-20",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.completed",
      data: {
        object: {
          id: mockSessionId,
          object: "checkout.session",
          amount_total: Math.round(createdOrder.totalAmount * 100),
          currency: "usd",
          payment_status: "paid",
          client_reference_id: createdOrder._id.toString(),
          metadata: {
            orderId: createdOrder._id.toString(),
            userId: testUser._id.toString(),
          },
          payment_intent: `pi_test_${Date.now()}`,
        },
      },
    };

    const rawPayload = JSON.stringify(webhookPayload);
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: webhookSecret,
    });

    // Send webhook
    const webhookRes1 = await fetch(`${baseUrl}/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": signature,
      },
      body: rawPayload,
    });

    const webhookData1 = await webhookRes1.json();
    assert(
      webhookRes1.status === 200 && webhookData1.received,
      "Webhook accepted and confirmed payment",
      webhookData1.message
    );

    const orderAfterWebhook = await Order.findById(createdOrder._id);
    assert(
      orderAfterWebhook.paymentStatus === "Completed",
      "Order paymentStatus updated to 'Completed'"
    );
    assert(
      Boolean(orderAfterWebhook.paidAt),
      "Order paidAt timestamp populated",
      orderAfterWebhook.paidAt?.toISOString()
    );
    assert(
      Boolean(orderAfterWebhook.stripePaymentIntentId),
      "Order stripePaymentIntentId saved",
      orderAfterWebhook.stripePaymentIntentId
    );

    // Duplicate Webhook Delivery (Idempotency)
    const webhookRes2 = await fetch(`${baseUrl}/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": signature,
      },
      body: rawPayload,
    });

    const webhookData2 = await webhookRes2.json();
    assert(
      webhookRes2.status === 200 &&
        webhookData2.message?.includes("already processed"),
      "Duplicate webhook handled idempotently without error",
      webhookData2.message
    );

    // -------------------------------------------------------------------------
    // TEST 5: Amount / Currency Mismatch Rejected by Webhook
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 5: Tampered Amount / Currency Rejected ---");
    const tamperedPayload = {
      ...webhookPayload,
      id: `evt_tampered_${Date.now()}`,
      data: {
        object: {
          ...webhookPayload.data.object,
          id: `cs_test_tampered_${Date.now()}`,
          amount_total: 100, // $1.00 instead of real total
        },
      },
    };
    const tamperedRaw = JSON.stringify(tamperedPayload);
    const tamperedSig = stripe.webhooks.generateTestHeaderString({
      payload: tamperedRaw,
      secret: webhookSecret,
    });

    const tamperedWebhookRes = await fetch(`${baseUrl}/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": tamperedSig,
      },
      body: tamperedRaw,
    });

    const tamperedWebhookData = await tamperedWebhookRes.json();
    assert(
      tamperedWebhookRes.status === 400 &&
        tamperedWebhookData.message?.includes("match"),
      "Webhook rejects tampered session amount/session ID",
      tamperedWebhookData.message
    );

    // -------------------------------------------------------------------------
    // TEST 6: Prevent Paid Orders from Cancellation
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 6: Paid Order Cancellation Prevention ---");
    const cancelPaidRes = await fetch(
      `${baseUrl}/orders/${createdOrder._id}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const cancelPaidData = await cancelPaidRes.json();
    assert(
      cancelPaidRes.status === 400 &&
        cancelPaidData.message?.includes("Cannot cancel a paid order"),
      "Customer cannot cancel an order that has already been paid",
      cancelPaidData.message
    );

    // -------------------------------------------------------------------------
    // TEST 7: Unpaid Order Cancellation & Exact Stock Restoration
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 7: Unpaid Order Cancellation & Stock Restoration ---");
    const freshPizza = await Pizza.findById(testPizza._id);
    const stockBeforeSecondOrder = freshPizza.stock;

    // Create another unpaid order
    const unpaidOrderRes = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const unpaidOrderData = await unpaidOrderRes.json();
    const unpaidOrder = unpaidOrderData.data;

    const pizzaAfterDeduct = await Pizza.findById(testPizza._id);
    assert(
      pizzaAfterDeduct.stock === stockBeforeSecondOrder - 2,
      "Inventory deducted 2 pizzas for second order"
    );

    // Cancel the unpaid order
    const cancelUnpaidRes = await fetch(
      `${baseUrl}/orders/${unpaidOrder._id}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const cancelUnpaidData = await cancelUnpaidRes.json();
    assert(
      cancelUnpaidRes.status === 200 && cancelUnpaidData.success,
      "Unpaid order cancelled successfully"
    );

    const pizzaAfterCancel = await Pizza.findById(testPizza._id);
    assert(
      pizzaAfterCancel.stock === stockBeforeSecondOrder,
      "Inventory fully and accurately restored using stockDeducted"
    );

    // -------------------------------------------------------------------------
    // TEST 8: Session Status Retrieval Endpoint
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 8: Session Status Retrieval API ---");
    const statusRes = await fetch(
      `${baseUrl}/payments/session-status/${mockSessionId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const statusData = await statusRes.json();
    assert(
      statusRes.status === 200 && statusData.success,
      "session-status endpoint returns successfully"
    );
    assert(
      statusData.data?.paymentStatus === "Completed",
      "session-status reflects Completed status",
      `paymentStatus: ${statusData.data?.paymentStatus}`
    );
    assert(
      statusData.data?.orderId === createdOrder._id.toString(),
      "session-status matches expected orderId"
    );

    // -------------------------------------------------------------------------
    // TEST 9: Async Payment Failed Webhook Event
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 9: Async Payment Failure Webhook ---");
    // Create another order for async fail test
    const failOrderRes = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const failOrderData = await failOrderRes.json();
    const failOrder = failOrderData.data;

    const asyncFailPayload = {
      id: `evt_async_fail_${Date.now()}`,
      object: "event",
      api_version: "2024-06-20",
      created: Math.floor(Date.now() / 1000),
      type: "checkout.session.async_payment_failed",
      data: {
        object: {
          id: `cs_fail_${Date.now()}`,
          object: "checkout.session",
          metadata: {
            orderId: failOrder._id.toString(),
            userId: testUser._id.toString(),
          },
        },
      },
    };
    const failRaw = JSON.stringify(asyncFailPayload);
    const failSig = stripe.webhooks.generateTestHeaderString({
      payload: failRaw,
      secret: webhookSecret,
    });

    const asyncFailRes = await fetch(`${baseUrl}/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": failSig,
      },
      body: failRaw,
    });
    const asyncFailData = await asyncFailRes.json();
    assert(
      asyncFailRes.status === 200 && asyncFailData.received,
      "checkout.session.async_payment_failed webhook acknowledged"
    );

    const failOrderAfter = await Order.findById(failOrder._id);
    assert(
      failOrderAfter.paymentStatus === "Failed",
      "Order paymentStatus marked as 'Failed' on async payment failure"
    );

    // Clean up test order pizzas
    await Pizza.findByIdAndUpdate(testPizza._id, { stock: initialStock });
  } finally {
    server.close();
    await mongoose.disconnect();
  }

  console.log("\n=================================================");
  console.log(`🏁 TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("=================================================\n");

  if (passed === total) {
    console.log("🎉 ALL STRIPE INTEGRATION TESTS PASSED PERFECTLY!");
    process.exit(0);
  } else {
    console.error("⚠️ Some tests failed. Please inspect the log.");
    process.exit(1);
  }
}

runStripeTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
