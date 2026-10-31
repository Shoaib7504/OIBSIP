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
  // --- 3 Customer Favorites ---
  {
    name: "Classic Margherita",
    description: "Classic delight with 100% real mozzarella cheese, San Marzano tomato sauce, and fresh aromatic basil leaves.",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=85",
    prices: { small: 8.99, medium: 12.99, large: 16.99 },
    rating: 4.9,
    stock: 25,
  },
  {
    name: "Spicy Pepperoni",
    description: "Loaded with double spicy beef pepperoni, melted mozzarella, crushed red pepper flakes, and hot marinara.",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=85",
    prices: { small: 10.99, medium: 15.99, large: 19.99 },
    rating: 4.8,
    stock: 20,
  },
  {
    name: "BBQ Chicken Bliss",
    description: "Tender BBQ grilled chicken chunks, red onions, bell peppers, smoky barbecue drizzle, and stretchy mozzarella.",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=85",
    prices: { small: 11.99, medium: 16.99, large: 21.99 },
    rating: 4.9,
    stock: 18,
  },

  // --- 8 Regular Flavours ---
  {
    name: "Pepperoni Classic",
    description: "Crisp artisanal pepperoni cups layered with gooey mozzarella & oregano.",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=85",
    prices: { small: 10.49, medium: 13.49, large: 17.49 },
    rating: 4.8,
    stock: 22,
  },
  {
    name: "Farm Fresh Veggie",
    description: "Crunchy green bell peppers, red onions, ripe tomatoes & black olives.",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=85",
    prices: { small: 9.49, medium: 11.99, large: 15.99 },
    rating: 4.7,
    stock: 30,
  },
  {
    name: "Cheese Burst",
    description: "Gooey mozzarella cheese inside the crust and overflowing on top.",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&auto=format&fit=crop&q=85",
    prices: { small: 9.99, medium: 12.99, large: 16.99 },
    rating: 4.9,
    stock: 20,
  },
  {
    name: "Spicy Jalapeño & Corn",
    description: "Zesty Mexican jalapeños balanced with golden sweet corn and chili flakes.",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=85",
    prices: { small: 8.99, medium: 10.99, large: 14.99 },
    rating: 4.6,
    stock: 15,
  },
  {
    name: "Mushroom Fiesta",
    description: "Herb-sautéed portobello and button mushrooms with garlic truffle sauce.",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&auto=format&fit=crop&q=85",
    prices: { small: 9.99, medium: 12.49, large: 16.49 },
    rating: 4.7,
    stock: 16,
  },
  {
    name: "Chicken Tikka Special",
    description: "Tandoori-spiced chicken, sliced red peppers, coriander & creamy tikka sauce.",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=85",
    prices: { small: 11.49, medium: 14.99, large: 18.99 },
    rating: 4.9,
    stock: 20,
  },
  {
    name: "Hawaiian Paradise",
    description: "Sweet caramelized roasted pineapple paired with savory smoked chicken ham.",
    category: "Non-Veg",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=85",
    prices: { small: 10.99, medium: 13.99, large: 17.99 },
    rating: 4.5,
    stock: 12,
  },
  {
    name: "Paneer Overload",
    description: "Soft marinated paneer cubes, capsicum, red paprika and rich tomato base.",
    category: "Veg",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&auto=format&fit=crop&q=85",
    prices: { small: 9.99, medium: 12.99, large: 16.99 },
    rating: 4.8,
    stock: 24,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    await Pizza.deleteMany();
    const result = await Pizza.insertMany(pizzas);
    console.log(`Successfully seeded ${result.length} authentic pizzas into database!`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
