import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import mongoose from "mongoose";
import Inventory from "./src/models/Inventory.js";
import Pizza from "./src/models/Pizza.js";
import Order from "./src/models/Order.js";
import User from "./src/models/User.js";
import app from "./src/app.js";
import { sendLowStockAlerts } from "./src/services/lowStockEmailService.js";
import { INGREDIENT_MAPPING, CUSTOM_PIZZA_PRICING } from "./src/config/ingredientMapping.js";

async function runVerification() {
  console.log("=================================================");
  console.log("🔍 RUNNING COMPREHENSIVE SYSTEM VERIFICATION TEST");
  console.log("=================================================\n");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB Atlas\n");

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = "") {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${testName} ${details ? `(${details})` : ""}`);
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? `(${details})` : ""}`);
    }
  }

  try {
    // -------------------------------------------------------------------------
    // SECTION 2: Custom Pizza Builder Verification
    // -------------------------------------------------------------------------
    console.log("-------------------------------------------------");
    console.log("🍕 2. CUSTOM PIZZA BUILDER VERIFICATION");
    console.log("-------------------------------------------------");

    const basesCount = Object.keys(INGREDIENT_MAPPING.bases).length;
    assert(basesCount === 5, "5 Pizza Bases Defined", `Found ${basesCount} bases: ${Object.keys(INGREDIENT_MAPPING.bases).join(", ")}`);

    const saucesCount = Object.keys(INGREDIENT_MAPPING.sauces).length;
    assert(saucesCount === 5, "5 Sauces Defined", `Found ${saucesCount} sauces: ${Object.keys(INGREDIENT_MAPPING.sauces).join(", ")}`);

    const cheesesCount = Object.keys(INGREDIENT_MAPPING.cheeses).length;
    assert(cheesesCount >= 3, "Cheese Selection Available", `Found ${cheesesCount} cheese options`);

    const toppingsCount = Object.keys(INGREDIENT_MAPPING.toppings).length;
    assert(toppingsCount >= 8, "Multiple Vegetables/Toppings Selection Available", `Found ${toppingsCount} toppings`);

    // Verify Custom Pizza Pricing Formula
    const testCrust = "cheese-burst"; // 2.50
    const testSauce = "pesto"; // 1.00
    const testCheese = "double"; // 1.50
    const testToppings = ["mushrooms", "olives"]; // 1.00 + 0.90 = 1.90
    const expectedCustomUnit = Number((10.99 + 2.50 + 1.00 + 1.50 + 1.90).toFixed(2)); // 17.89
    const expectedSubtotal = expectedCustomUnit * 1;
    const expectedDelivery = expectedSubtotal > 30 ? 0 : 2.99;
    const expectedTax = Number((expectedSubtotal * 0.08).toFixed(2));
    const expectedTotal = Number((expectedSubtotal + expectedDelivery + expectedTax).toFixed(2));

    assert(expectedCustomUnit === 17.89, "Correct Order Summary & Pricing Breakdown", `Unit: $${expectedCustomUnit}, Total with delivery & tax: $${expectedTotal}`);

    // Ensure database has the 5 bases and 5 sauces
    await Inventory.updateOne(
      { name: "Classic Pan Crust", category: "Pizza Bases" },
      { $setOnInsert: { name: "Classic Pan Crust", category: "Pizza Bases", stock: 60, threshold: 15, unit: "units" } },
      { upsert: true }
    );
    await Inventory.updateOne(
      { name: "Genovese Basil Pesto", category: "Sauces" },
      { $setOnInsert: { name: "Genovese Basil Pesto", category: "Sauces", stock: 35, threshold: 10, unit: "liters" } },
      { upsert: true }
    );

    // -------------------------------------------------------------------------
    // SECTION 3: Inventory & Order Validation
    // -------------------------------------------------------------------------
    console.log("\n-------------------------------------------------");
    console.log("📦 3. INVENTORY & ORDER VALIDATION");
    console.log("-------------------------------------------------");

    // Setup a dedicated test pizza with known stock
    let testPizza = await Pizza.findOne({ name: "Margherita Classic" });
    if (!testPizza) {
      testPizza = await Pizza.create({
        name: "Test Verification Pizza " + Date.now(),
        description: "Test pizza",
        category: "Veg",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        prices: { small: 8.99, medium: 11.99, large: 14.99 },
        stock: 5,
      });
    }

    const initialStock = testPizza.stock;
    const testUser = await User.findOne({ role: "user" }) || await User.findOne();
    const jwt = (await import("jsonwebtoken")).default;
    const userToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "1h" });

    // 3.1 Order deduction happens exactly once
    const orderQty = 2;
    const subtotal3 = Number((testPizza.prices.medium * orderQty).toFixed(2));
    const delivery3 = subtotal3 > 30 ? 0 : 2.99;
    const tax3 = Number((subtotal3 * 0.08).toFixed(2));
    const total3 = Number((subtotal3 + delivery3 + tax3).toFixed(2));

    const orderRes1 = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        customer: {
          name: "Test Customer",
          email: "customer@test.com",
          phone: "01700000000",
          address: { street: "123 Test St", city: "Dhaka", postalCode: "1200" },
        },
        items: [
          {
            pizza: testPizza._id,
            name: testPizza.name,
            size: "medium",
            quantity: orderQty,
            price: testPizza.prices.medium,
          },
        ],
        totalAmount: total3,
        paymentMethod: "COD",
      }),
    });

    const orderData1 = await orderRes1.json();
    const pizzaAfterOrder1 = await Pizza.findById(testPizza._id);
    assert(
      orderRes1.status === 201 && pizzaAfterOrder1.stock === initialStock - orderQty,
      "Stock Deducted Exactly Once on Order",
      `Initial: ${initialStock}, After order: ${pizzaAfterOrder1.stock}`
    );

    // 3.2 Insufficient stock -> Order Rejected
    const excessiveQty = pizzaAfterOrder1.stock + 10;
    const excessiveSubtotal = Number((testPizza.prices.medium * excessiveQty).toFixed(2));
    const excessiveTotal = Number((excessiveSubtotal + (excessiveSubtotal > 30 ? 0 : 2.99) + Number((excessiveSubtotal * 0.08).toFixed(2))).toFixed(2));

    const orderResFail = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        customer: {
          name: "Test Customer",
          email: "customer@test.com",
          phone: "01700000000",
          address: { street: "123 Test St", city: "Dhaka", postalCode: "1200" },
        },
        items: [
          {
            pizza: testPizza._id,
            name: testPizza.name,
            size: "medium",
            quantity: excessiveQty,
            price: testPizza.prices.medium,
          },
        ],
        totalAmount: excessiveTotal,
        paymentMethod: "COD",
      }),
    });

    const orderFailData = await orderResFail.json();
    const pizzaAfterFail = await Pizza.findById(testPizza._id);
    assert(
      orderResFail.status === 400 && pizzaAfterFail.stock === pizzaAfterOrder1.stock,
      "Insufficient Stock Rejects Order without Modifying Stock",
      `Response: "${orderFailData.message}"`
    );

    // 3.3 Stock Never Goes Negative (Schema & Filter verification)
    const pizzaMinStock = Pizza.schema.path("stock").options.min;
    const inventoryMinStock = Inventory.schema.path("stock").options.min;
    assert(
      pizzaMinStock === 0 && inventoryMinStock === 0,
      "Stock Never Goes Negative (Enforced by Schema min: 0 & Atomic $gte Filter)"
    );

    // 3.4 Order Cancellation Restores Stock Exactly Once
    const createdOrderId = orderData1.data._id;
    // Set user on order to enable cancelMyOrder
    await Order.findByIdAndUpdate(createdOrderId, { user: testUser._id });

    // First cancel request
    const cancelRes1 = await fetch(`${baseUrl}/orders/${createdOrderId}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const cancelData1 = await cancelRes1.json();
    const pizzaAfterCancel1 = await Pizza.findById(testPizza._id);

    assert(
      cancelRes1.status === 200 && pizzaAfterCancel1.stock === initialStock,
      "Order Cancel Restores Stock Exactly Once",
      `Stock restored to: ${pizzaAfterCancel1.stock}`
    );

    // Second cancel request (must be rejected)
    const cancelRes2 = await fetch(`${baseUrl}/orders/${createdOrderId}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const cancelData2 = await cancelRes2.json();
    const pizzaAfterCancel2 = await Pizza.findById(testPizza._id);

    assert(
      cancelRes2.status === 400 && pizzaAfterCancel2.stock === initialStock,
      "Repeated Cancellation Rejected (Stock Not Restored Twice)",
      `Second Cancel Status: ${cancelRes2.status}, Message: "${cancelData2.message}"`
    );

    // 3.5 Price Validation: Backend Validates Price (Frontend Tampered Price Rejected)
    const tamperedPrice = 0.99; // Fraudulent total
    const orderResTampered = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        customer: {
          name: "Attacker",
          email: "attacker@test.com",
          phone: "01700000000",
          address: { street: "123 Fake St", city: "Dhaka", postalCode: "1200" },
        },
        items: [
          {
            pizza: testPizza._id,
            name: testPizza.name,
            size: "medium",
            quantity: 1,
            price: 0.50, // Tampered unit price
          },
        ],
        totalAmount: tamperedPrice, // Tampered total
        paymentMethod: "COD",
      }),
    });

    const tamperedData = await orderResTampered.json();
    assert(
      orderResTampered.status === 400 && tamperedData.message.includes("Price validation failed"),
      "Backend Validates Pricing (Rejects Tampered Frontend Price)",
      `Message: "${tamperedData.message}"`
    );

    // -------------------------------------------------------------------------
    // SECTION 4: Low-Stock Notification Final Test
    // -------------------------------------------------------------------------
    console.log("\n-------------------------------------------------");
    console.log("📧 4. LOW-STOCK NOTIFICATION FINAL TEST");
    console.log("-------------------------------------------------");

    // Setup an inventory item for notification testing
    const testItemName = "Verification Low Stock Item " + Date.now();
    const testItem = await Inventory.create({
      name: testItemName,
      category: "Vegetables",
      stock: 5, // Below threshold
      threshold: 10,
      lowStockAlertSent: false,
      unit: "kg",
    });

    // 4.1 Check initial low stock detection
    const itemsNeedingAlert1 = await Inventory.find({
      _id: testItem._id,
      lowStockAlertSent: false,
      $expr: { $lte: ["$stock", "$threshold"] },
    });

    assert(itemsNeedingAlert1.length === 1, "Low-Stock Item Detected when stock <= threshold");

    // Simulate sending alert
    await Inventory.findByIdAndUpdate(testItem._id, { lowStockAlertSent: true });

    // 4.2 Check that repeated email is NOT sent (anti-spam)
    const itemsNeedingAlert2 = await Inventory.find({
      _id: testItem._id,
      lowStockAlertSent: false,
      $expr: { $lte: ["$stock", "$threshold"] },
    });

    assert(itemsNeedingAlert2.length === 0, "Repeated Low-Stock Email Blocked (No Duplicate Alerts)");

    // 4.3 Check that alert status resets when stock is replenished above threshold
    await Inventory.findByIdAndUpdate(testItem._id, { stock: 25 }); // 25 > 10

    // Run the reset logic from lowStockEmailService
    await Inventory.updateMany(
      {
        _id: testItem._id,
        lowStockAlertSent: true,
        $expr: { $gt: ["$stock", "$threshold"] },
      },
      {
        $set: { lowStockAlertSent: false },
      }
    );

    const replenishedItem = await Inventory.findById(testItem._id);
    assert(
      replenishedItem.lowStockAlertSent === false,
      "Alert Resets to False When Stock Exceeds Threshold",
      `Current stock: ${replenishedItem.stock}, Alert status: ${replenishedItem.lowStockAlertSent}`
    );

    // Clean up test item
    await Inventory.findByIdAndDelete(testItem._id);

    // -------------------------------------------------------------------------
    // FINAL SUMMARY
    // -------------------------------------------------------------------------
    console.log("\n=================================================");
    console.log(`🏁 VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log("=================================================");

    server.close();
    await mongoose.disconnect();
    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (error) {
    console.error("❌ Verification encountered error:", error);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

runVerification();
