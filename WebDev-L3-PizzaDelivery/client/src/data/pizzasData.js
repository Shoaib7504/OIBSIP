// Pizza Menu Data with high-definition food photography, ratings, tags, and prices

export const PIZZA_IMAGES = {
  // Hero & Featured
  heroPizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=85",
  dealPizza: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900&auto=format&fit=crop&q=85",
  storyPizza: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=85",
  customizerBase: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=85",

  // Customer Favorites
  margherita: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=85",
  spicyPepperoni: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=85",
  bbqChicken: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=85",

  // 8 Regular Flavours
  pepperoniClassic: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=85",
  farmFreshVeggie: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=85",
  cheeseBurst: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&auto=format&fit=crop&q=85",
  spicyJalapenoCorn: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=85",
  mushroomFiesta: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&auto=format&fit=crop&q=85",
  chickenTikka: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=85",
  hawaiianParadise: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=85",
  paneerOverload: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&auto=format&fit=crop&q=85",
};

// 3 Customer Favorites
export const customerFavorites = [
  {
    id: "fav-1",
    name: "Classic Margherita",
    category: "Veg",
    isVeg: true,
    rating: 4.9,
    reviews: 142,
    description: "Classic delight with 100% real mozzarella cheese, San Marzano tomato sauce, and fresh aromatic basil leaves.",
    price: 8.99,
    image: PIZZA_IMAGES.margherita,
    badge: "100% Veg",
    sizes: { small: 8.99, medium: 12.99, large: 16.99 },
  },
  {
    id: "fav-2",
    name: "Spicy Pepperoni",
    category: "Non-Veg",
    isVeg: false,
    rating: 4.8,
    reviews: 198,
    description: "Loaded with double spicy beef pepperoni, melted mozzarella, crushed red pepper flakes, and hot marinara.",
    price: 10.99,
    image: PIZZA_IMAGES.spicyPepperoni,
    badge: "Bestseller",
    sizes: { small: 10.99, medium: 15.99, large: 19.99 },
  },
  {
    id: "fav-3",
    name: "BBQ Chicken Bliss",
    category: "Non-Veg",
    isVeg: false,
    rating: 4.9,
    reviews: 116,
    description: "Tender BBQ grilled chicken chunks, red onions, bell peppers, smoky barbecue drizzle, and stretchy mozzarella.",
    price: 11.99,
    image: PIZZA_IMAGES.bbqChicken,
    badge: "Chef's Special",
    sizes: { small: 11.99, medium: 16.99, large: 21.99 },
  },
];

// 8 Regular Flavours matching screenshot
export const regularFlavours = [
  {
    id: "reg-1",
    name: "Pepperoni Classic",
    category: "Non-Veg",
    isVeg: false,
    rating: 4.8,
    description: "Crisp artisanal pepperoni cups layered with gooey mozzarella & oregano.",
    price: 13.49,
    image: PIZZA_IMAGES.pepperoniClassic,
  },
  {
    id: "reg-2",
    name: "Farm Fresh Veggie",
    category: "Veg",
    isVeg: true,
    rating: 4.7,
    description: "Crunchy green bell peppers, red onions, ripe tomatoes & black olives.",
    price: 11.99,
    image: PIZZA_IMAGES.farmFreshVeggie,
  },
  {
    id: "reg-3",
    name: "Cheese Burst",
    category: "Veg",
    isVeg: true,
    rating: 4.9,
    description: "Gooey mozzarella cheese inside the crust and overflowing on top.",
    price: 12.99,
    image: PIZZA_IMAGES.cheeseBurst,
  },
  {
    id: "reg-4",
    name: "Spicy Jalapeño & Corn",
    category: "Veg",
    isVeg: true,
    rating: 4.6,
    description: "Zesty Mexican jalapeños balanced with golden sweet corn and chili flakes.",
    price: 10.99,
    image: PIZZA_IMAGES.spicyJalapenoCorn,
  },
  {
    id: "reg-5",
    name: "Mushroom Fiesta",
    category: "Veg",
    isVeg: true,
    rating: 4.7,
    description: "Herb-sautéed portobello and button mushrooms with garlic truffle sauce.",
    price: 12.49,
    image: PIZZA_IMAGES.mushroomFiesta,
  },
  {
    id: "reg-6",
    name: "Chicken Tikka Special",
    category: "Non-Veg",
    isVeg: false,
    rating: 4.9,
    description: "Tandoori-spiced chicken, sliced red peppers, coriander & creamy tikka sauce.",
    price: 14.99,
    image: PIZZA_IMAGES.chickenTikka,
  },
  {
    id: "reg-7",
    name: "Hawaiian Paradise",
    category: "Non-Veg",
    isVeg: false,
    rating: 4.5,
    description: "Sweet caramelized roasted pineapple paired with savory smoked chicken ham.",
    price: 13.99,
    image: PIZZA_IMAGES.hawaiianParadise,
  },
  {
    id: "reg-8",
    name: "Paneer Overload",
    category: "Veg",
    isVeg: true,
    rating: 4.8,
    description: "Soft marinated paneer cubes, capsicum, red paprika and rich tomato base.",
    price: 12.99,
    image: PIZZA_IMAGES.paneerOverload,
  },
];

// 3 Mini Cards in the Hero section (top right)
export const heroMiniCards = [
  {
    id: "mini-1",
    name: "Margherita",
    price: "$8.99",
    image: PIZZA_IMAGES.margherita,
  },
  {
    id: "mini-2",
    name: "Pepperoni",
    price: "$10.99",
    image: PIZZA_IMAGES.spicyPepperoni,
  },
  {
    id: "mini-3",
    name: "BBQ Chicken",
    price: "$11.99",
    image: PIZZA_IMAGES.bbqChicken,
  },
];
