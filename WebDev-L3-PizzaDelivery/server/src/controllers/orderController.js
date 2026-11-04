import mongoose from "mongoose";
import Order from "../models/Order.js";
import Pizza from "../models/Pizza.js";
import Inventory from "../models/Inventory.js";
import { CUSTOM_PIZZA_PRICING } from "../config/ingredientMapping.js";

import {
  calculateIngredientRequirements,
  deductInventoryIngredients,
} from "../utils/inventoryHelper.js";
// Place a new order & decrement pizza stock in MongoDB
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!customer || !Number.isFinite(Number(totalAmount)) || Number(totalAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order details",
      });
    }

    let createdOrder;

    await session.withTransaction(async () => {
      // 1. Validate custom pizza size
      for (const item of items) {
        if (item.customOptions && item.size?.toLowerCase() !== "medium") {
          throw new Error(
            "Custom pizza is currently available in Medium size only"
          );
        }
      }

      // 2. Calculate required ingredients
      const ingredientRequirements =
        calculateIngredientRequirements(items);

      // 3. Deduct ingredient inventory
      const inventoryDeductions = await deductInventoryIngredients(
        ingredientRequirements,
        session
      );

      // 4. Resolve pizzas, calculate backend prices, and deduct pizza stock atomically
      const processedItems = [];
      let backendCalculatedSubtotal = 0;

      for (const item of items) {
        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error("Invalid pizza quantity");
        }

        let itemUnitPrice = 0;
        let pizza = null;

        if (item.customOptions) {
          // Custom Pizza: Calculate price strictly from backend configuration
          const crustId = item.customOptions.crust;
          const sauceId = item.customOptions.sauce;
          const cheeseId = item.customOptions.cheese;
          const toppings = item.customOptions.toppings || [];

          const crustCost = CUSTOM_PIZZA_PRICING.crusts[crustId];
          const sauceCost = CUSTOM_PIZZA_PRICING.sauces[sauceId];
          const cheeseCost = CUSTOM_PIZZA_PRICING.cheeses[cheeseId];

          if (crustCost === undefined || sauceCost === undefined || cheeseCost === undefined) {
            throw new Error("Invalid custom pizza options selected");
          }

          let toppingsCost = 0;
          for (const tId of toppings) {
            const tCost = CUSTOM_PIZZA_PRICING.toppings[tId];
            if (tCost === undefined) {
              throw new Error(`Invalid topping selected: ${tId}`);
            }
            toppingsCost += tCost;
          }

          itemUnitPrice = Number(
            (
              CUSTOM_PIZZA_PRICING.basePrice +
              crustCost +
              sauceCost +
              cheeseCost +
              toppingsCost
            ).toFixed(2)
          );

          backendCalculatedSubtotal += itemUnitPrice * quantity;

          processedItems.push({
            ...item,
            size: "medium",
            price: itemUnitPrice,
          });
        } else {
          // Regular Pizza: Resolve from DB and lookup price
          if (item.pizza && mongoose.Types.ObjectId.isValid(item.pizza)) {
            pizza = await Pizza.findById(item.pizza).session(session);
          }

          if (!pizza && item.name) {
            const cleanName = item.name.trim();

            pizza =
              (await Pizza.findOne({
                name: { $regex: new RegExp(`^${cleanName}$`, "i") },
              }).session(session)) ||
              (await Pizza.findOne({
                name: {
                  $regex: new RegExp(cleanName.split(" ")[0], "i"),
                },
              }).session(session));
          }

          if (!pizza) {
            throw new Error(`Pizza not found: ${item.name || item.pizza}`);
          }

          const size = (item.size || "medium").toLowerCase();
          itemUnitPrice =
            pizza.prices?.[size] ?? pizza.prices?.medium ?? pizza.price;

          if (!itemUnitPrice) {
            throw new Error(`Invalid price for size ${size} of ${pizza.name}`);
          }

          itemUnitPrice = Number(itemUnitPrice);
          backendCalculatedSubtotal += itemUnitPrice * quantity;

          const updatedPizza = await Pizza.findOneAndUpdate(
            {
              _id: pizza._id,
              stock: { $gte: quantity },
            },
            {
              $inc: { stock: -quantity },
            },
            {
              new: true,
              session,
            }
          );

          if (!updatedPizza) {
            throw new Error(
              pizza.stock === 0
                ? `${pizza.name} is out of stock`
                : `Insufficient stock for ${pizza.name}`
            );
          }

          processedItems.push({
            ...item,
            size,
            price: itemUnitPrice,
            pizza: pizza._id,
          });
        }
      }

      // 5. Backend Price Validation (Delivery fee + 8% tax)
      const backendDeliveryFee =
        backendCalculatedSubtotal > 30 || backendCalculatedSubtotal === 0 ? 0 : 2.99;
      const backendTax = Number((backendCalculatedSubtotal * 0.08).toFixed(2));
      const backendCalculatedTotal = Number(
        (backendCalculatedSubtotal + backendDeliveryFee + backendTax).toFixed(2)
      );

      // Validate frontend total amount against backend calculation (tolerance $0.15 for float rounding)
      if (Math.abs(Number(totalAmount) - backendCalculatedTotal) > 0.15) {
        throw new Error(
          `Price validation failed: Server computed total $${backendCalculatedTotal}, but received $${totalAmount}`
        );
      }

      // 6. Create order inside the same transaction with validated total
      const [order] = await Order.create(
        [
          {
            user: req.user?.id || null,
            customer,
            items: processedItems,
            inventoryDeductions,
            totalAmount: backendCalculatedTotal,
            paymentMethod,
          },
        ],
        { session }
      );

      createdOrder = order;
    });

    return res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (err) {
    if (
      err.message.includes("Insufficient stock") ||
      err.message.includes("out of stock") ||
      err.message.includes("Invalid") ||
      err.message.includes("not found") ||
      err.message.includes("Custom pizza") ||
      err.message.includes("Price validation")
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next(err);
  } finally {
    await session.endSession();
  }
};

// Get all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.email) filter["customer.email"] = req.query.email;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// Get single order
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    //Admin only access every order
    if (
      req.user.role !== "admin" &&
      order.user?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order"
      })
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, paymentStatus: req.body.paymentStatus },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

//get only logged in user orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};


//Cancel customer's own order
export const cancelMyOrder = async (req, res, next) => {
  const session = await Order.db.startSession();

  try {
    session.startTransaction();

    // 1. Atomically cancel an eligible order
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        status: { $nin: ["Delivered", "Cancelled"] },
      },
      {
        $set: { status: "Cancelled" },
      },
      {
        new: true,
        session,
      }
    );

    // 2. Check why cancellation failed
    if (!order) {
      const existingOrder = await Order.findById(req.params.id).session(
        session
      );

      await session.abortTransaction();

      if (
        !existingOrder ||
        existingOrder.user?.toString() !== req.user._id.toString()
      ) {
        return res.status(404).json({
          success: false,
          message: "Order not found or you are not authorized",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order with status: ${existingOrder.status}`,
      });
    }

    // 3. Restore pizza stock
    for (const item of order.items) {
      if (item.pizza) {
        const restoredPizza = await Pizza.findByIdAndUpdate(
          item.pizza,
          {
            $inc: { stock: item.quantity },
          },
          { session }
        );

        if (!restoredPizza) {
          throw new Error(`Pizza not found while restoring: ${item.name}`);
        }
      }
    }

    // 4. Restore custom pizza ingredients
    for (const deduction of order.inventoryDeductions || []) {
      const restoredIngredient = await Inventory.findByIdAndUpdate(
        deduction.inventory,
        {
          $inc: { stock: deduction.quantity },
        },
        { session }
      );

      if (!restoredIngredient) {
        throw new Error(
          `Inventory item not found while restoring: ${deduction.name}`
        );
      }
    }

    // 5. Commit all changes
    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Order cancelled and inventory restored successfully",
      data: order,
    });
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    next(err);
  } finally {
    await session.endSession();
  }
};