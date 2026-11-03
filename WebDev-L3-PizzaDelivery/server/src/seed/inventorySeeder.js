import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Inventory from "../models/Inventory.js";

dotenv.config();

const inventoryItems = [
  // Pizza Bases
  { name: "Sourdough Regular", category: "Pizza Bases", stock: 120, threshold: 20, unit: "units" },
  { name: "Thin & Crispy", category: "Pizza Bases", stock: 85, threshold: 15, unit: "units" },
  { name: "Gluten-Free", category: "Pizza Bases", stock: 40, threshold: 10, unit: "units" },
  { name: "Stuffed Crust", category: "Pizza Bases", stock: 60, threshold: 15, unit: "units" },

  // Sauces
  { name: "San Marzano Tomato", category: "Sauces", stock: 95, threshold: 20, unit: "liters" },
  { name: "Creamy Alfredo", category: "Sauces", stock: 50, threshold: 15, unit: "liters" },
  { name: "Spicy Arrabbiata", category: "Sauces", stock: 45, threshold: 12, unit: "liters" },
  { name: "Smoky BBQ", category: "Sauces", stock: 55, threshold: 15, unit: "liters" },

  // Cheeses
  { name: "Fior di Latte Mozzarella", category: "Cheeses", stock: 80, threshold: 20, unit: "kg" },
  { name: "Smoked Provolone", category: "Cheeses", stock: 35, threshold: 10, unit: "kg" },
  { name: "Aged Cheddar", category: "Cheeses", stock: 45, threshold: 12, unit: "kg" },
  { name: "Gorgonzola", category: "Cheeses", stock: 25, threshold: 8, unit: "kg" },

  // Vegetables
  { name: "Fresh Basil", category: "Vegetables", stock: 60, threshold: 15, unit: "bunches" },
  { name: "Cherry Tomatoes", category: "Vegetables", stock: 70, threshold: 20, unit: "kg" },
  { name: "Bell Peppers", category: "Vegetables", stock: 55, threshold: 15, unit: "kg" },
  { name: "Mushrooms", category: "Vegetables", stock: 40, threshold: 12, unit: "kg" },
  { name: "Black Olives", category: "Vegetables", stock: 30, threshold: 10, unit: "kg" },
  { name: "Pepperoni", category: "Vegetables", stock: 65, threshold: 18, unit: "kg" },
];

const seedInventory = async () => {
  try {
    await connectDB();

    const operations = inventoryItems.map((item) => ({
      updateOne: {
        filter: {
          name: item.name,
          category: item.category,
        },
        update: {
          $setOnInsert: item,
        },
        upsert: true,
      },
    }));

    await Inventory.bulkWrite(operations);

    const totalItems = await Inventory.countDocuments();

    console.log("Inventory seeding completed!");
    console.log(`Total inventory items: ${totalItems}`);
  } catch (error) {
    console.error("Inventory seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedInventory();