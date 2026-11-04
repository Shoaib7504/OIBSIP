import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Inventory from "../models/Inventory.js";

dotenv.config();

const inventoryItems = [
  // Pizza Bases (5 Bases)
  {
    name: "Sourdough Regular",
    category: "Pizza Bases",
    stock: 120,
    threshold: 20,
    unit: "units",
  },
  {
    name: "Thin & Crispy",
    category: "Pizza Bases",
    stock: 85,
    threshold: 15,
    unit: "units",
  },
  {
    name: "Gluten-Free",
    category: "Pizza Bases",
    stock: 40,
    threshold: 10,
    unit: "units",
  },
  {
    name: "Cheese Burst",
    category: "Pizza Bases",
    stock: 60,
    threshold: 15,
    unit: "units",
  },
  {
    name: "Classic Pan Crust",
    category: "Pizza Bases",
    stock: 75,
    threshold: 15,
    unit: "units",
  },

  // Sauces (5 Sauces)
  {
    name: "San Marzano Marinara",
    category: "Sauces",
    stock: 95,
    threshold: 20,
    unit: "liters",
  },
  {
    name: "Creamy Garlic White Sauce",
    category: "Sauces",
    stock: 50,
    threshold: 15,
    unit: "liters",
  },
  {
    name: "Spicy Arrabbiata",
    category: "Sauces",
    stock: 45,
    threshold: 12,
    unit: "liters",
  },
  {
    name: "Smoky Texas BBQ",
    category: "Sauces",
    stock: 55,
    threshold: 15,
    unit: "liters",
  },
  {
    name: "Genovese Basil Pesto",
    category: "Sauces",
    stock: 40,
    threshold: 10,
    unit: "liters",
  },

  // Cheeses
  {
    name: "Standard Mozzarella",
    category: "Cheeses",
    stock: 80,
    threshold: 20,
    unit: "kg",
  },
  {
    name: "Double Mozzarella",
    category: "Cheeses",
    stock: 35,
    threshold: 10,
    unit: "kg",
  },
  {
    name: "Vegan Cheese",
    category: "Cheeses",
    stock: 45,
    threshold: 12,
    unit: "kg",
  },

  // Vegetables
  {
    name: "Mushrooms",
    category: "Vegetables",
    stock: 40,
    threshold: 12,
    unit: "kg",
  },
  {
    name: "Black Olives",
    category: "Vegetables",
    stock: 30,
    threshold: 10,
    unit: "kg",
  },
  {
    name: "Golden Sweet Corn",
    category: "Vegetables",
    stock: 50,
    threshold: 15,
    unit: "kg",
  },
  {
    name: "Pickled Jalapeños",
    category: "Vegetables",
    stock: 35,
    threshold: 10,
    unit: "kg",
  },
  {
    name: "Marinated Paneer",
    category: "Vegetables",
    stock: 40,
    threshold: 12,
    unit: "kg",
  },
  {
    name: "Fresh Garden Basil",
    category: "Vegetables",
    stock: 60,
    threshold: 15,
    unit: "bunches",
  },

  // Meats
  {
    name: "Crispy Pepperoni",
    category: "Meats",
    stock: 65,
    threshold: 18,
    unit: "kg",
  },
  {
    name: "Grilled Herb Chicken",
    category: "Meats",
    stock: 50,
    threshold: 15,
    unit: "kg",
  },
];

const obsoleteInventoryItems = [
  { name: "Stuffed Crust", category: "Pizza Bases" },
  { name: "San Marzano Tomato", category: "Sauces" },
  { name: "Creamy Alfredo", category: "Sauces" },
  { name: "Smoky BBQ", category: "Sauces" },
  { name: "Fior di Latte Mozzarella", category: "Cheeses" },
  { name: "Smoked Provolone", category: "Cheeses" },
  { name: "Aged Cheddar", category: "Cheeses" },
  { name: "Gorgonzola", category: "Cheeses" },
  { name: "Fresh Basil", category: "Vegetables" },
  { name: "Cherry Tomatoes", category: "Vegetables" },
  { name: "Bell Peppers", category: "Vegetables" },
  { name: "Pepperoni", category: "Vegetables" },
];

const seedInventory = async () => {
  try {
    await connectDB();

    // Insert new items without resetting existing stock
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

    // Remove obsolete inventory records
    await Inventory.deleteMany({
      $or: obsoleteInventoryItems,
    });

    const totalItems = await Inventory.countDocuments();

    console.log("Inventory seeding completed!");
    console.log(`Expected inventory items: ${inventoryItems.length}`);
    console.log(`Total inventory items: ${totalItems}`);
  } catch (error) {
    console.error("Inventory seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedInventory();
