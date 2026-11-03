
import Inventory from "../models/Inventory.js";
import {
  INGREDIENT_MAPPING,
  INGREDIENT_CONSUMPTION,
} from "../config/ingredientMapping.js";

// Build ingredient requirements for custom pizza items
export const calculateIngredientRequirements = (items) => {
  const requirements = new Map();

  const addRequirement = (name, category, quantity) => {
    const key = `${name}:${category}`;

    const existing = requirements.get(key);

    if (existing) {
      existing.quantity += quantity;
    } else {
      requirements.set(key, {
        name,
        category,
        quantity,
      });
    }
  };

  for (const item of items) {
    const options = item.customOptions;

    // Standard pizzas without custom options are skipped
    if (!options) continue;

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid pizza quantity");
    }

    const baseName = Object.entries(INGREDIENT_MAPPING.bases)
      .find(([id]) => id === options.crust)?.[1];

    const sauceName = Object.entries(INGREDIENT_MAPPING.sauces)
      .find(([id]) => id === options.sauce)?.[1];

    const cheeseName = Object.entries(INGREDIENT_MAPPING.cheeses)
      .find(([id]) => id === options.cheese)?.[1];

    if (!baseName || !sauceName || !cheeseName) {
      throw new Error("Invalid custom pizza ingredients");
    }

    addRequirement(
      baseName,
      "Pizza Bases",
      INGREDIENT_CONSUMPTION.base * quantity
    );

    addRequirement(
      sauceName,
      "Sauces",
      INGREDIENT_CONSUMPTION.sauce * quantity
    );

    addRequirement(
      cheeseName,
      "Cheeses",
      INGREDIENT_CONSUMPTION.cheese * quantity
    );

    const toppings = options.toppings || [];

    if (!Array.isArray(toppings)) {
      throw new Error("Invalid pizza toppings");
    }

    for (const toppingId of new Set(toppings)) {
      const topping = INGREDIENT_MAPPING.toppings[toppingId];

      if (!topping) {
        throw new Error(`Invalid topping: ${toppingId}`);
      }

      addRequirement(
        topping.name,
        topping.category,
        INGREDIENT_CONSUMPTION.topping * quantity
      );
    }
  }

  return Array.from(requirements.values());
};

// Deduct ingredients using the supplied MongoDB transaction session
export const deductInventoryIngredients = async (
  requirements,
  session
) => {
  const deductions = [];

  for (const requirement of requirements) {
    const updatedItem = await Inventory.findOneAndUpdate(
      {
        name: requirement.name,
        category: requirement.category,
        stock: { $gte: requirement.quantity },
      },
      {
        $inc: { stock: -requirement.quantity },
      },
      {
        new: true,
        session,
      }
    );

    if (!updatedItem) {
      const existingItem = await Inventory.findOne({
        name: requirement.name,
        category: requirement.category,
      }).session(session);

      if (!existingItem) {
        throw new Error(
          `Inventory item not found: ${requirement.name}`
        );
      }

      throw new Error(
        `Insufficient stock for ${requirement.name}. Available: ${existingItem.stock}, Required: ${requirement.quantity}`
      );
    }

    deductions.push({
      inventory: updatedItem._id,
      name: updatedItem.name,
      category: updatedItem.category,
      quantity: requirement.quantity,
    });
  }

  return deductions;
};
