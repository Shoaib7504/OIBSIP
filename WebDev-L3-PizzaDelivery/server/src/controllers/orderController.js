import mongoose from "mongoose";
import Order from "../models/Order.js";
import Pizza from "../models/Pizza.js";

// Place a new order & decrement pizza stock in MongoDB
export const createOrder = async (req, res, next) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Resolve pizza and check stock for each item
    for (const item of items) {
      let pizza = null;

      if (item.pizza && mongoose.Types.ObjectId.isValid(item.pizza)) {
        pizza = await Pizza.findById(item.pizza);
      }

      // If not resolved by ID, match by pizza name
      if (!pizza && item.name) {
        const cleanName = item.name.trim();
        pizza =
          (await Pizza.findOne({ name: { $regex: new RegExp(`^${cleanName}$`, "i") } })) ||
          (await Pizza.findOne({ name: { $regex: new RegExp(cleanName.split(" ")[0], "i") } }));
      }

      if (pizza) {
        item.pizza = pizza._id; // Attach real MongoDB ObjectId
        if (pizza.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message:
              pizza.stock === 0
                ? `${pizza.name} is out of stock`
                : `Only ${pizza.stock} ${pizza.name} left in stock`,
          });
        }
      }
    }

    // Decrement stock for each resolved pizza in MongoDB
    for (const item of items) {
      if (item.pizza) {
        await Pizza.findByIdAndUpdate(item.pizza, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    const order = await Order.create({
      user: req.body.user || null,
      customer,
      items,
      totalAmount,
      paymentMethod,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
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
   if(
    req.user.role !=="admin"&&
    order.user?.toString() !==req.user._id.toString()
   ){
    return res.status(403).json({
        success:false,
        message:"Not authorized to view this order"
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

//get logged in user orders
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