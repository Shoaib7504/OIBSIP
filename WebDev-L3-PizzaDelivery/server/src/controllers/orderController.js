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
            stockDeducted: 0,
          });
        } else {
          const cleanName = (item.name || "").trim();

          // Check if item is a promotional deal / combo
          let dealConfig = null;
          if (/pepperoni.*combo|large pepperoni/i.test(cleanName)) {
            dealConfig = {
              name: "Large Pepperoni + 2 Drinks Combo",
              price: 14.99,
              pizzaSearch: "Pepperoni",
              stockQty: 1,
            };
          } else if (/margherita.*combo|bogo.*margherita/i.test(cleanName)) {
            dealConfig = {
              name: "BOGO Margherita Combo",
              price: 12.99,
              pizzaSearch: "Margherita",
              stockQty: 2,
            };
          }

          if (dealConfig) {
            // Find base pizza in database for stock deduction
            pizza =
              (await Pizza.findOne({
                name: { $regex: new RegExp(dealConfig.pizzaSearch, "i") },
              }).session(session)) ||
              (await Pizza.findOne().session(session));

            if (!pizza) {
              throw new Error(`Base pizza not found for ${cleanName}`);
            }

            itemUnitPrice = dealConfig.price;
            backendCalculatedSubtotal += itemUnitPrice * quantity;

            const requiredStock = dealConfig.stockQty * quantity;
            const updatedPizza = await Pizza.findOneAndUpdate(
              {
                _id: pizza._id,
                stock: { $gte: requiredStock },
              },
              {
                $inc: { stock: -requiredStock },
              },
              {
                new: true,
                session,
              }
            );

            if (!updatedPizza) {
              throw new Error(
                pizza.stock === 0
                  ? `${cleanName} is out of stock`
                  : `Insufficient stock for ${cleanName}`
              );
            }

            processedItems.push({
              ...item,
              size: (item.size || "large").toLowerCase(),
              price: itemUnitPrice,
              pizza: pizza._id,
              stockDeducted: requiredStock,
            });
          } else {
            // Regular Pizza: Resolve from DB and lookup price
            if (item.pizza && mongoose.Types.ObjectId.isValid(item.pizza)) {
              pizza = await Pizza.findById(item.pizza).session(session);
            }

            if (!pizza && item.name) {
              pizza =
                (await Pizza.findOne({
                  name: { $regex: new RegExp(`^${cleanName}$`, "i") },
                }).session(session)) ||
                (await Pizza.findOne({
                  name: {
                    $regex: new RegExp(cleanName.replace(/pizza/i, "").trim().split(" ")[0], "i"),
                  },
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

            let size = (item.size || "medium").toLowerCase();
            let itemUnitPrice =
              pizza.prices?.[size] ?? pizza.prices?.medium ?? pizza.price;

            // If item.price was sent and differs from current size, resolve to matching valid size or candidate pizza
            if (item.price && Math.abs(itemUnitPrice - Number(item.price)) > 0.05) {
              let matched = false;

              // 1. Check if price matches another size of this pizza
              if (pizza.prices) {
                for (const [s, p] of Object.entries(pizza.prices)) {
                  if (Math.abs(p - Number(item.price)) <= 0.05) {
                    size = s;
                    itemUnitPrice = p;
                    matched = true;
                    break;
                  }
                }
              }

              // 2. Check candidate pizzas matching name keyword (e.g. Spicy Pepperoni vs Pepperoni Classic)
              if (!matched) {
                const keyword = cleanName.replace(/pizza/i, "").trim().split(" ")[0];
                const candidates = await Pizza.find({
                  name: { $regex: new RegExp(keyword, "i") },
                }).session(session);

                for (const candidate of candidates) {
                  if (candidate.prices) {
                    for (const [s, p] of Object.entries(candidate.prices)) {
                      if (Math.abs(p - Number(item.price)) <= 0.05) {
                        pizza = candidate;
                        size = s;
                        itemUnitPrice = p;
                        matched = true;
                        break;
                      }
                    }
                  }
                  if (matched) break;
                }
              }
            }

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
              stockDeducted: quantity,
            });
          }
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
            paymentMethod: ["COD", "Card", "UPI", "Stripe"].includes(paymentMethod)
              ? paymentMethod
              : "COD",
            paymentStatus: "Pending",
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
// Admin can update order delivery status only
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const allowedStatuses = [
      "Placed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Payment status must never be changed through this endpoint
    if (req.body.paymentStatus !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Payment status cannot be updated through this endpoint",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
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
// Cancel customer's own unpaid order and restore inventory

export const cancelMyOrder = async (req, res, next) => {
  const session = await Order.db.startSession();

  try {
    session.startTransaction();

    const orderId = req.params.id;
    const userId = req.user?._id?.toString();

    // 1. Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    // 2. Verify authentication
    if (!userId) {
      await session.abortTransaction();

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 3. Find and atomically cancel the eligible order
    const isAdmin = req.user?.role === "admin";
    const cancelFilter = {
      _id: orderId,
      status: { $nin: ["Delivered", "Cancelled"] },
      paymentStatus: { $ne: "Completed" },
    };

    if (!isAdmin) {
      cancelFilter.user = userId;
    }

    const order = await Order.findOneAndUpdate(
      cancelFilter,
      {
        $set: {
          status: "Cancelled",
        },
      },
      {
        new: true,
        session,
      }
    );

    // 4. Handle cancellation failure
    if (!order) {
      const existingOrder = await Order.findById(orderId).session(session);

      await session.abortTransaction();

      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Verify order ownership for non-admin users
      if (!isAdmin && existingOrder.user?.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to cancel this order",
        });
      }

      // Prevent cancellation of paid orders
      if (existingOrder.paymentStatus === "Completed") {
        return res.status(400).json({
          success: false,
          message:
            "Cannot cancel a paid order. Please contact customer support for refunds.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order with status: ${existingOrder.status}`,
      });
    }

    // 5. Restore deducted pizza stock
    for (const item of order.items) {
      if (!item.pizza) continue;

      const restoreQty =
        typeof item.stockDeducted === "number" &&
        item.stockDeducted > 0
          ? item.stockDeducted
          : item.quantity;

      const restoredPizza = await Pizza.findByIdAndUpdate(
        item.pizza,
        {
          $inc: {
            stock: restoreQty,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!restoredPizza) {
        throw new Error(
          `Pizza not found while restoring: ${item.name}`
        );
      }
    }

    // 6. Restore custom pizza ingredients
    for (const deduction of order.inventoryDeductions || []) {
      const restoredIngredient = await Inventory.findByIdAndUpdate(
        deduction.inventory,
        {
          $inc: {
            stock: deduction.quantity,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!restoredIngredient) {
        throw new Error(
          `Inventory item not found while restoring: ${deduction.name}`
        );
      }
    }

    // 7. Commit transaction
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Order cancelled and inventory restored successfully",
      data: order,
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    next(error);

  } finally {
    await session.endSession();
  }
};
