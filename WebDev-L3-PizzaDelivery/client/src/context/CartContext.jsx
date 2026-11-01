import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load initial cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("pizzacrave_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activePizzaModal, setActivePizzaModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pizzacrave_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (pizza, size = "Medium", customOptions = null) => {
    // Determine unit price based on size
    const selectedSize = size.toLowerCase();

    let unitPrice = pizza.prices?.[selectedSize];

    if (unitPrice === undefined) {
      unitPrice = pizza.price;
    }

    unitPrice = Number(unitPrice);


    if (customOptions?.extraPrice) {
      unitPrice += customOptions.extraPrice;
    }

    const pizzaId = pizza._id || pizza.id;

    const cartKey = `${pizzaId}-${size}-${customOptions ? JSON.stringify(customOptions) : "standard"}`;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prevItems.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          cartKey,
          id: pizza._id || pizza.id,
          _id: pizza._id || pizza.id,
          pizza: pizza._id || pizza.id,
          name: pizza.name,
          image: pizza.image,
          price: unitPrice,
          size,
          quantity: 1,
          customOptions,
        },
      ];
    });

    showToast(`Added ${pizza.name} (${size}) to your cart!`);
  };

  const updateQuantity = (cartKey, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartKey === cartKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 30 || subtotal === 0 ? 0 : 2.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        tax,
        total,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        isCustomizerOpen,
        setIsCustomizerOpen,
        isSearchOpen,
        setIsSearchOpen,
        activePizzaModal,
        setActivePizzaModal,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

