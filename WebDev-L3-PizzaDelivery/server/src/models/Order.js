import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza" },
  name: { type: String, required: true },
  size: {
    type: String,
    enum: ["small", "medium", "large"],
    default: "medium",
    set: (v) => (v ? v.toLowerCase() : "medium"),
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },

  customOptions: {
    crust: { type: String },
    sauce: { type: String },
    cheese: { type: String },
    toppings: {
      type: [String],
      default: [],
    },
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
      },
    },
    items: [orderItemSchema],
    inventoryDeductions: [
      {
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
