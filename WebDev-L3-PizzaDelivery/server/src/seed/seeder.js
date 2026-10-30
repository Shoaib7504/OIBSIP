import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dns from "dns";
import Pizza from "../models/Pizza.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const pizzas = [
  {
    name: "Margherita",
    description: "Fresh mozzarella, tomato sauce, basil",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800",
    prices: { small: 8.99, medium: 12.99, large: 16.99 },
    rating: 4.8,
  },
  {
    name: "Pepperoni",
    description: "Pepperoni slices, mozzarella, tomato sauce",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
    prices: { small: 10.99, medium: 15.99, large: 19.99 },
    rating: 4.9,
  },
  {
    name: "BBQ Chicken",
    description: "Grilled chicken, BBQ sauce, onions, peppers",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    prices: { small: 11.99, medium: 16.99, large: 21.99 },
    rating: 4.7,
  },
  {
    name: "Veggie Supreme",
    description: "Olives, mushrooms, peppers, corn, onions",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    prices: { small: 9.99, medium: 14.49, large: 18.49 },
    rating: 4.6,
  },
  {
    name: "Four Cheese",
    description: "Mozzarella, cheddar, parmesan, gouda",
    category: "Specialty",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    prices: { small: 12.49, medium: 17.99, large: 22.99 },
    rating: 4.9,
  },
  {
    name: "Paneer Tikka",
    description: "Spiced paneer, capsicum, onions, jalapeños",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800",
    prices: { small: 10.49, medium: 14.99, large: 19.49 },
    rating: 4.5,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    await Pizza.deleteMany();
    await Pizza.insertMany(pizzas);
    console.log("Seeded " + pizzas.length + " pizzas");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
