import mongoose from "mongoose";

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Veg", "Non-Veg", "Specialty"],
    },
    image: {
      type: String,
      required: true,
    },
    variants: {
      type: [String],
      default: ["small", "medium", "large"],
    },
    prices: {
      small: { type: Number, required: true },
      medium: { type: Number, required: true },
      large: { type: Number, required: true },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      default: 20,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pizza", pizzaSchema);
