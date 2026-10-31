import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// ─── Storage Keys ───────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  orders: "pizzacrave_orders",
  inventory: "pizzacrave_inventory",
};

// ─── BroadcastChannel Name ──────────────────────────────────────────────────
const SYNC_CHANNEL = "pizzacrave_sync";

// ─── Initial Inventory Seed Data ────────────────────────────────────────────
const INITIAL_INVENTORY = [
  // Pizza Bases
  { id: "base-1", category: "Pizza Bases", name: "Sourdough Regular", stock: 120, threshold: 20, unit: "units" },
  { id: "base-2", category: "Pizza Bases", name: "Thin & Crispy", stock: 85, threshold: 15, unit: "units" },
  { id: "base-3", category: "Pizza Bases", name: "Gluten-Free", stock: 40, threshold: 10, unit: "units" },
  { id: "base-4", category: "Pizza Bases", name: "Stuffed Crust", stock: 60, threshold: 15, unit: "units" },
  // Sauces
  { id: "sauce-1", category: "Sauces", name: "San Marzano Tomato", stock: 95, threshold: 20, unit: "liters" },
  { id: "sauce-2", category: "Sauces", name: "Creamy Alfredo", stock: 50, threshold: 15, unit: "liters" },
  { id: "sauce-3", category: "Sauces", name: "Spicy Arrabbiata", stock: 45, threshold: 12, unit: "liters" },
  { id: "sauce-4", category: "Sauces", name: "Smoky BBQ", stock: 55, threshold: 15, unit: "liters" },
  // Cheeses
  { id: "cheese-1", category: "Cheeses", name: "Fior di Latte Mozzarella", stock: 80, threshold: 20, unit: "kg" },
  { id: "cheese-2", category: "Cheeses", name: "Smoked Provolone", stock: 35, threshold: 10, unit: "kg" },
  { id: "cheese-3", category: "Cheeses", name: "Aged Cheddar", stock: 45, threshold: 12, unit: "kg" },
  { id: "cheese-4", category: "Cheeses", name: "Gorgonzola", stock: 25, threshold: 8, unit: "kg" },
  // Vegetables
  { id: "veg-1", category: "Vegetables", name: "Fresh Basil", stock: 60, threshold: 15, unit: "bunches" },
  { id: "veg-2", category: "Vegetables", name: "Cherry Tomatoes", stock: 70, threshold: 20, unit: "kg" },
  { id: "veg-3", category: "Vegetables", name: "Bell Peppers", stock: 55, threshold: 15, unit: "kg" },
  { id: "veg-4", category: "Vegetables", name: "Mushrooms", stock: 40, threshold: 12, unit: "kg" },
  { id: "veg-5", category: "Vegetables", name: "Black Olives", stock: 30, threshold: 10, unit: "kg" },
  { id: "veg-6", category: "Vegetables", name: "Pepperoni", stock: 65, threshold: 18, unit: "kg" },
];

// ─── Helper: Generate a random 5-digit order ID ────────────────────────────
function generateOrderId() {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${digits}`;
}

// ─── Seed Demo Orders ───────────────────────────────────────────────────────
function createSeedOrders() {
  const now = new Date();
  const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const ninetyMinsAgo = new Date(now.getTime() - 90 * 60 * 1000);

  return [
    {
      id: "ORD-10042",
      items: [
        { name: "Margherita Classica", size: "Large", quantity: 1, price: 16.99, image: "/pizzas/margherita.webp" },
        { name: "Pepperoni Supremo", size: "Medium", quantity: 2, price: 14.99, image: "/pizzas/pepperoni.webp" },
      ],
      status: "in_kitchen",
      statusHistory: [
        { status: "received", timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString() },
        { status: "in_kitchen", timestamp: new Date(now.getTime() - 8 * 60 * 1000).toISOString() },
      ],
      subtotal: 46.97,
      deliveryFee: 3.99,
      tax: 4.08,
      total: 55.04,
      customerName: "You",
      deliveryAddress: "123 Main Street, Apt 4B",
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
    },
    {
      id: "ORD-10037",
      items: [
        { name: "Quattro Formaggi", size: "Large", quantity: 1, price: 18.99, image: "/pizzas/quattro.webp" },
      ],
      status: "delivered",
      statusHistory: [
        { status: "received", timestamp: twoHoursAgo.toISOString() },
        { status: "in_kitchen", timestamp: new Date(twoHoursAgo.getTime() + 10 * 60 * 1000).toISOString() },
        { status: "sent_to_delivery", timestamp: ninetyMinsAgo.toISOString() },
        { status: "delivered", timestamp: new Date(ninetyMinsAgo.getTime() + 25 * 60 * 1000).toISOString() },
      ],
      subtotal: 18.99,
      deliveryFee: 3.99,
      tax: 1.84,
      total: 24.82,
      customerName: "You",
      deliveryAddress: "123 Main Street, Apt 4B",
      createdAt: twoHoursAgo.toISOString(),
      estimatedDelivery: new Date(twoHoursAgo.getTime() + 30 * 60 * 1000).toISOString(),
    },
  ];
}

// ─── localStorage Helpers ───────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that parsed data is an array and non-empty
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`[PizzaCrave] Failed to load "${key}" from localStorage:`, err);
  }
  return typeof fallback === "function" ? fallback() : fallback;
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[PizzaCrave] Failed to save "${key}" to localStorage:`, err);
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
const OrderInventoryContext = createContext(null);

/**
 * OrderInventoryProvider
 *
 * Central state management for orders and inventory.
 * Persists to localStorage and syncs across tabs via BroadcastChannel.
 */
export function OrderInventoryProvider({ children }) {
  // ── State ───────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState(() =>
    loadFromStorage(STORAGE_KEYS.orders, createSeedOrders)
  );

  const [inventory, setInventory] = useState(() =>
    loadFromStorage(STORAGE_KEYS.inventory, INITIAL_INVENTORY)
  );

  // ── Persist to localStorage on state change ─────────────────────────────
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.inventory, inventory);
  }, [inventory]);

  // ── Cross-Tab Sync via BroadcastChannel ─────────────────────────────────
  useEffect(() => {
    // BroadcastChannel may not be available in all environments
    if (typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(SYNC_CHANNEL);

    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};

      switch (type) {
        case "NEW_ORDER":
          // Merge a new order (avoid duplicates)
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === payload.id);
            if (exists) return prev;
            return [payload, ...prev];
          });
          break;

        case "ORDER_UPDATE":
          // Replace the updated order in state
          setOrders((prev) =>
            prev.map((o) => (o.id === payload.id ? payload : o))
          );
          break;

        case "INVENTORY_UPDATE":
          // Full inventory replacement from another tab
          if (Array.isArray(payload)) {
            setInventory(payload);
          }
          break;

        default:
          break;
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  /**
   * Broadcast a sync message to other tabs.
   */
  const broadcast = useCallback((type, payload) => {
    try {
      if (typeof BroadcastChannel === "undefined") return;
      const channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.postMessage({ type, payload });
      channel.close();
    } catch (err) {
      console.warn("[PizzaCrave] BroadcastChannel send failed:", err);
    }
  }, []);

  // ── Order Actions ───────────────────────────────────────────────────────

  /**
   * Place a new order.
   * Creates the order object, auto-decrements inventory, and broadcasts.
   *
   * @param {Array} cartItems - Items in the cart [{ name, size, quantity, price, image }]
   * @param {number} subtotal
   * @param {number} deliveryFee
   * @param {number} tax
   * @param {number} total
   * @returns {Object} The newly created order
   */
  const placeOrder = useCallback(
    (cartItems, subtotal, deliveryFee, tax, total) => {
      const now = new Date();
      const newOrder = {
        id: generateOrderId(),
        items: cartItems.map((item) => ({
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        status: "received",
        statusHistory: [
          { status: "received", timestamp: now.toISOString() },
        ],
        subtotal,
        deliveryFee,
        tax,
        total,
        customerName: "You",
        deliveryAddress: "123 Main Street, Apt 4B",
        createdAt: now.toISOString(),
        estimatedDelivery: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
      };

      // Auto-decrement inventory: 1 base, 0.5L sauce, 0.3kg cheese per pizza item
      const totalPizzaQty = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

      setInventory((prev) => {
        const updated = prev.map((item) => {
          // Decrement the first available item in each category proportionally
          if (item.category === "Pizza Bases" && item.id === "base-1") {
            return { ...item, stock: Math.max(0, item.stock - totalPizzaQty) };
          }
          if (item.category === "Sauces" && item.id === "sauce-1") {
            return { ...item, stock: Math.max(0, item.stock - totalPizzaQty * 0.5) };
          }
          if (item.category === "Cheeses" && item.id === "cheese-1") {
            return { ...item, stock: Math.max(0, item.stock - totalPizzaQty * 0.3) };
          }
          return item;
        });

        // Broadcast inventory update to other tabs
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });

      // Add order to state
      setOrders((prev) => [newOrder, ...prev]);

      // Broadcast new order to other tabs
      broadcast("NEW_ORDER", newOrder);

      return newOrder;
    },
    [broadcast]
  );

  /**
   * Advance an order's status and push to its statusHistory.
   *
   * @param {string} orderId
   * @param {string} newStatus - "received" | "in_kitchen" | "sent_to_delivery" | "delivered"
   */
  const updateOrderStatus = useCallback(
    (orderId, newStatus) => {
      setOrders((prev) => {
        const updated = prev.map((order) => {
          if (order.id !== orderId) return order;

          const updatedOrder = {
            ...order,
            status: newStatus,
            statusHistory: [
              ...order.statusHistory,
              { status: newStatus, timestamp: new Date().toISOString() },
            ],
          };

          // Broadcast the update to other tabs
          broadcast("ORDER_UPDATE", updatedOrder);
          return updatedOrder;
        });

        return updated;
      });
    },
    [broadcast]
  );

  /**
   * Cancel an order by setting its status to "cancelled".
   *
   * @param {string} orderId
   */
  const cancelOrder = useCallback(
    (orderId) => {
      setOrders((prev) => {
        const updated = prev.map((order) => {
          if (order.id !== orderId) return order;

          const cancelledOrder = {
            ...order,
            status: "cancelled",
            statusHistory: [
              ...order.statusHistory,
              { status: "cancelled", timestamp: new Date().toISOString() },
            ],
          };

          broadcast("ORDER_UPDATE", cancelledOrder);
          return cancelledOrder;
        });

        return updated;
      });
    },
    [broadcast]
  );

  // ── Inventory Actions ───────────────────────────────────────────────────

  /**
   * Manually set the stock level for an inventory item.
   *
   * @param {string} itemId
   * @param {number} newStock
   */
  const updateStock = useCallback(
    (itemId, newStock) => {
      setInventory((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId ? { ...item, stock: Math.max(0, newStock) } : item
        );
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });
    },
    [broadcast]
  );

  /**
   * Update the low-stock threshold for an inventory item.
   *
   * @param {string} itemId
   * @param {number} newThreshold
   */
  const updateThreshold = useCallback(
    (itemId, newThreshold) => {
      setInventory((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId
            ? { ...item, threshold: Math.max(0, newThreshold) }
            : item
        );
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });
    },
    [broadcast]
  );

  /**
   * Add stock to an inventory item (restock).
   *
   * @param {string} itemId
   * @param {number} addAmount - Amount to add to current stock
   */
  const restockItem = useCallback(
    (itemId, addAmount) => {
      setInventory((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId
            ? { ...item, stock: item.stock + Math.max(0, addAmount) }
            : item
        );
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });
    },
    [broadcast]
  );

  // ── Derived / Query Helpers ─────────────────────────────────────────────

  /**
   * Get all inventory items where stock is at or below the threshold.
   *
   * @returns {Array} Low-stock inventory items
   */
  const getLowStockItems = useCallback(() => {
    return inventory.filter((item) => item.stock <= item.threshold);
  }, [inventory]);

  /**
   * Filter orders by a specific status.
   *
   * @param {string} status
   * @returns {Array} Matching orders
   */
  const getOrdersByStatus = useCallback(
    (status) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  // ── Memoized Context Value ──────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      // State
      orders,
      inventory,

      // Order actions
      placeOrder,
      updateOrderStatus,
      cancelOrder,

      // Inventory actions
      updateStock,
      updateThreshold,
      restockItem,

      // Query helpers
      getLowStockItems,
      getOrdersByStatus,
    }),
    [
      orders,
      inventory,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      updateStock,
      updateThreshold,
      restockItem,
      getLowStockItems,
      getOrdersByStatus,
    ]
  );

  return (
    <OrderInventoryContext.Provider value={contextValue}>
      {children}
    </OrderInventoryContext.Provider>
  );
}

/**
 * useOrderInventory
 *
 * Custom hook to consume the OrderInventory context.
 * Throws if used outside of <OrderInventoryProvider>.
 */
export function useOrderInventory() {
  const context = useContext(OrderInventoryContext);

  if (!context) {
    throw new Error(
      "useOrderInventory must be used within an <OrderInventoryProvider>. " +
        "Wrap your component tree with <OrderInventoryProvider>."
    );
  }

  return context;
}

export default OrderInventoryContext;
