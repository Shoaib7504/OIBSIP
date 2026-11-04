export const INGREDIENT_MAPPING = {
  // Pizza Bases
  bases: {
    sourdough: "Sourdough Regular",
    thin: "Thin & Crispy",
    "cheese-burst": "Cheese Burst",
    "gluten-free": "Gluten-Free",
    "pan-crust": "Classic Pan Crust",
  },

  // Sauces
  sauces: {
    marinara: "San Marzano Marinara",
    arrabiata: "Spicy Arrabbiata",
    garlic: "Creamy Garlic White Sauce",
    bbq: "Smoky Texas BBQ",
    pesto: "Genovese Basil Pesto",
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

// Custom pizza pricing for backend price validation
export const CUSTOM_PIZZA_PRICING = {
  basePrice: 10.99,
  crusts: {
    sourdough: 0,
    thin: 0,
    "cheese-burst": 2.50,
    "gluten-free": 2.00,
    "pan-crust": 1.50,
  },
  sauces: {
    marinara: 0,
    arrabiata: 0.50,
    garlic: 0.75,
    bbq: 0.75,
    pesto: 1.00,
  },
  cheeses: {
    standard: 0,
    double: 1.50,
    vegan: 1.25,
  },
  toppings: {
    pepperoni: 1.50,
    chicken: 1.75,
    mushrooms: 1.00,
    olives: 0.90,
    corn: 0.80,
    jalapeno: 0.80,
    paneer: 1.50,
    basil: 0.50,
  },
};
