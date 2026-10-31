/**
 * Normalizes pizza objects between MongoDB backend schema and client UI schema.
 * Ensures consistent access to id, price, sizes/prices, isVeg, image, and description.
 */
export const normalizePizza = (pizza) => {
  if (!pizza) return null;

  const id = pizza._id || pizza.id || `pizza-${Math.random().toString(36).substr(2, 9)}`;

  // Determine standard base price
  let price = 11.99;
  if (typeof pizza.price === "number" && !isNaN(pizza.price)) {
    price = pizza.price;
  } else if (pizza.prices?.small && typeof pizza.prices.small === "number") {
    price = pizza.prices.small;
  } else if (pizza.sizes?.small && typeof pizza.sizes.small === "number") {
    price = pizza.sizes.small;
  } else if (pizza.prices?.medium && typeof pizza.prices.medium === "number") {
    price = pizza.prices.medium;
  }

  // Consistent sizes / prices map for QuickViewModal and CartContext
  const sizes = pizza.sizes || pizza.prices || {
    small: Number(price.toFixed(2)),
    medium: Number((price + 3.5).toFixed(2)),
    large: Number((price + 7).toFixed(2)),
  };

  const isVeg =
    typeof pizza.isVeg === "boolean"
      ? pizza.isVeg
      : String(pizza.category).toLowerCase().includes("veg") &&
        !String(pizza.category).toLowerCase().includes("non");

  return {
    ...pizza,
    id,
    _id: id,
    name: pizza.name || "Artisan Pizza",
    description: pizza.description || "Authentic wood-fired pizza with handcrafted toppings.",
    category: pizza.category || (isVeg ? "Veg" : "Non-Veg"),
    isVeg,
    image: pizza.image,
    price: Number(price),
    prices: sizes,
    sizes,
    rating: pizza.rating || 4.8,
    reviews: pizza.reviews || 95,
    badge: pizza.badge || (isVeg ? "100% Veg" : undefined),
    stock: typeof pizza.stock === "number" ? pizza.stock : 20,
  };
};

export const normalizePizzas = (pizzas = []) => {
  if (!Array.isArray(pizzas)) return [];
  return pizzas.map(normalizePizza).filter(Boolean);
};

