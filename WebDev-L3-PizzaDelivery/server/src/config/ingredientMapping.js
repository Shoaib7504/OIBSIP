
export const INGREDIENT_MAPPING = {
  // Pizza Bases
  bases: {
    sourdough: "Sourdough Regular",
    thin: "Thin & Crispy",
    "cheese-burst": "Cheese Burst",
    "gluten-free": "Gluten-Free",
  },

  // Sauces
  sauces: {
    marinara: "San Marzano Marinara",
    arrabiata: "Spicy Arrabbiata",
    garlic: "Creamy Garlic White Sauce",
    bbq: "Smoky Texas BBQ",
  },

  // Cheeses
  cheeses: {
    standard: "Standard Mozzarella",
    double: "Double Mozzarella",
    vegan: "Vegan Cheese",
  },

  // Toppings
  toppings: {
    pepperoni: {
      name: "Crispy Pepperoni",
      category: "Meats",
    },
    chicken: {
      name: "Grilled Herb Chicken",
      category: "Meats",
    },
    mushrooms: {
      name: "Mushrooms",
      category: "Vegetables",
    },
    olives: {
      name: "Black Olives",
      category: "Vegetables",
    },
    corn: {
      name: "Golden Sweet Corn",
      category: "Vegetables",
    },
    jalapeno: {
      name: "Pickled Jalapeños",
      category: "Vegetables",
    },
    paneer: {
      name: "Marinated Paneer",
      category: "Vegetables",
    },
    basil: {
      name: "Fresh Garden Basil",
      category: "Vegetables",
    },
  },
};

// Medium pizza consumption
export const INGREDIENT_CONSUMPTION = {
  base: 1,
  sauce: 0.1,
  cheese: 0.15,
  topping: 0.05,
};
