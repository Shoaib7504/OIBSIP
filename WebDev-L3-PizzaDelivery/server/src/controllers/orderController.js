import Order from "../models/Order.js";
import Pizza from "../models/Pizza.js";

// place a new order
export const createOrder = async (req, res, next) => {
  try {
    const { customer, items, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // check stock for each item
    for (const item of items) {
      if (!item.pizza) continue;
      const pizza = await Pizza.findById(item.pizza);
      if (!pizza) {
        return res.status(400).json({ success: false, message: `${item.name} is no longer available` });
      }
      if (pizza.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: pizza.stock === 0
            ? `${pizza.name} is out of stock`
            : `Only ${pizza.stock} ${pizza.name} left in stock`,
        });
      }
    }

    // reduce stock
    for (const item of items) {
      if (!item.pizza) continue;
      await Pizza.findByIdAndUpdate(item.pizza, { $inc: { stock: -item.quantity } });
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

// get all orders
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

// get single order
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// update order status
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
