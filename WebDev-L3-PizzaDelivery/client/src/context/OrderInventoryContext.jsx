import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getAllOrders as fetchBackendOrders,
  getMyOrders as fetchMyBackendOrders,
  createOrder as createBackendOrderApi,
  updateOrderStatus as updateBackendOrderStatusApi,
} from "../services/orderServices";

import { useAuth } from "./AuthContext";
// Storage Keys
const STORAGE_KEYS = {
  orders: "pizzacrave_orders",
  inventory: "pizzacrave_inventory",
};

// BroadcastChannel Name
const SYNC_CHANNEL = "pizzacrave_sync";

// Initial Inventory Seed Data
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

/**
 * Status Mapping Helpers
 */
export const backendStatusToUiStatus = (status) => {
  const map = {
    placed: "received",
    received: "received",
    pending: "received",
    preparing: "in_kitchen",
    in_kitchen: "in_kitchen",
    "out for delivery": "sent_to_delivery",
    out_for_delivery: "sent_to_delivery",
    sent_to_delivery: "sent_to_delivery",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[String(status).toLowerCase()] || "received";
};

export const uiStatusToBackendStatus = (status) => {
  const map = {
    received: "Placed",
    in_kitchen: "Preparing",
    sent_to_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] || "Placed";
};

/**
 * Normalizes backend MongoDB orders to fit the client UI schema seamlessly
 */
export const normalizeBackendOrder = (order) => {
  if (!order) return null;
  const id = order._id || order.id;
  const uiStatus = backendStatusToUiStatus(order.status);
  const now = new Date(order.createdAt || Date.now());

  const deliveryAddress = order.customer?.address
    ? `${order.customer.address.street}, ${order.customer.address.city} ${order.customer.address.postalCode || ""
      }`.trim()
    : order.deliveryAddress || "Standard Delivery";

  return {
    ...order,
    id,
    _id: id,
    customerName: order.customer?.name || order.customerName || "Customer",
    customerEmail: order.customer?.email || order.customerEmail || "",
    customerPhone: order.customer?.phone || order.customerPhone || "",
    deliveryAddress,
    total: typeof order.totalAmount === "number" ? order.totalAmount : order.total || 0,
    subtotal:
      order.subtotal ||
      (typeof order.totalAmount === "number"
        ? Number((order.totalAmount * 0.85).toFixed(2))
        : 0),
    deliveryFee: order.deliveryFee ?? 0,
    tax: order.tax ?? 0,
    status: uiStatus,
    rawStatus: order.status,
    paymentMethod: order.paymentMethod || "COD",
    paymentStatus: order.paymentStatus || "Pending",
    items: (order.items || []).map((item) => ({
      name: item.name,
      size: item.size
        ? item.size.charAt(0).toUpperCase() + item.size.slice(1)
        : "Medium",
      quantity: item.quantity || 1,
      price: item.price || 0,
      image: item.image || item.pizza?.image || "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800",
    })),
    statusHistory: order.statusHistory || [
      { status: "received", timestamp: order.createdAt || now.toISOString() },
      ...(uiStatus !== "received"
        ? [{ status: uiStatus, timestamp: order.updatedAt || new Date().toISOString() }]
        : []),
    ],
    createdAt: order.createdAt || now.toISOString(),
    estimatedDelivery:
      order.estimatedDelivery ||
      new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
  };
};

//  localStorage Helpers 
function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
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

//  Context 
const OrderInventoryContext = createContext(null);

export function OrderInventoryProvider({ children }) {

  const { user } = useAuth()
  const [orders, setOrders] = useState(() => loadFromStorage(STORAGE_KEYS.orders, []));
  const [inventory, setInventory] = useState(() =>
    loadFromStorage(STORAGE_KEYS.inventory, INITIAL_INVENTORY)
  );
  const [isSyncing, setIsSyncing] = useState(false);

  //  Persist to localStorage 
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.inventory, inventory);
  }, [inventory]);

  //  Cross-Tab Sync via BroadcastChannel 
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;

    let channel;
    try {
      channel = new BroadcastChannel(SYNC_CHANNEL);
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === "ORDER_UPDATE") {
          setOrders((prev) =>
            prev.map((ord) => (ord.id === payload.id ? { ...ord, ...payload } : ord))
          );
        } else if (type === "NEW_ORDER") {
          setOrders((prev) => {
            if (prev.some((o) => o.id === payload.id)) return prev;
            return [payload, ...prev];
          });
        } else if (type === "INVENTORY_UPDATE") {
          setInventory(payload);
        }
      };
    } catch (err) {
      console.warn("[PizzaCrave] BroadcastChannel listener failed:", err);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

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

  // Sync with Backend Orders 
  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setIsSyncing(true);

      const res =
        user.role === "admin"
          ? await fetchBackendOrders()
          : await fetchMyBackendOrders();

      if (res?.success && Array.isArray(res.data)) {
        const normalized = res.data.map(normalizeBackendOrder);
        setOrders(normalized);
      }
    } catch (err) {
      console.warn(
        "[PizzaCrave] Backend orders sync failed:",
        err.message
      );
    } finally {
      setIsSyncing(false);
    }
  }, [user?._id, user?.role]);
  // Initial load and periodic polling every 6 seconds for real-time order tracking
  useEffect(() => {
    refreshOrders();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshOrders();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [refreshOrders]);

  //  Order Creation (Direct to Backend) 
  const placeBackendOrder = useCallback(
    async (orderPayload) => {
      try {
        const res = await createBackendOrderApi(orderPayload);
        if (!res?.success || !res?.data) {
          throw new Error(res?.message || "Failed to create order on server");
        }

        const newOrder = normalizeBackendOrder(res.data);

        // Update local state
        setOrders((prev) => [newOrder, ...prev]);

        // Auto-decrement inventory in UI
        const totalPizzaQty = (orderPayload.items || []).reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );

        setInventory((prev) => {
          const updated = prev.map((item) => {
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

          broadcast("INVENTORY_UPDATE", updated);
          return updated;
        });

        broadcast("NEW_ORDER", newOrder);
        return newOrder;
      } catch (err) {
        console.error("[PizzaCrave] placeBackendOrder error:", err);
        throw err;
      }
    },
    [broadcast]
  );

  //  Update Order Status (Admin to Backend) 
  const updateOrderStatus = useCallback(
    async (orderId, newUiStatus) => {
      const backendStatus = uiStatusToBackendStatus(newUiStatus);

      // Optimistic update in UI
      setOrders((prev) => {
        const updated = prev.map((order) => {
          if (order.id !== orderId && order._id !== orderId) return order;

          const updatedOrder = {
            ...order,
            status: newUiStatus,
            rawStatus: backendStatus,
            statusHistory: [
              ...(order.statusHistory || []),
              { status: newUiStatus, timestamp: new Date().toISOString() },
            ],
          };

          broadcast("ORDER_UPDATE", updatedOrder);
          return updatedOrder;
        });
        return updated;
      });

      // Send update to Backend API if it's a valid MongoDB ID
      try {
        if (orderId && orderId.length === 24) {
          await updateBackendOrderStatusApi(orderId, backendStatus);
        }
      } catch (err) {
        console.error(`[PizzaCrave] Failed to update order ${orderId} on backend:`, err);
        refreshOrders(); // Re-sync on error
      }
    },
    [broadcast, refreshOrders]
  );

  const cancelOrder = useCallback(
    (orderId) => {
      return updateOrderStatus(orderId, "cancelled");
    },
    [updateOrderStatus]
  );

  //  Manual Inventory Controls 
  const updateStock = useCallback(
    (itemId, newStock) => {
      setInventory((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId
            ? { ...item, stock: Math.max(0, Math.round(newStock * 10) / 10) }
            : item
        );
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });
    },
    [broadcast]
  );

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

  const resetInventoryItem = useCallback(
    (itemId) => {
      const initial = INITIAL_INVENTORY.find((i) => i.id === itemId);
      if (!initial) return;
      setInventory((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId ? { ...item, stock: initial.stock } : item
        );
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });
    },
    [broadcast]
  );

  const updateThreshold = useCallback(
    (itemId, newThreshold) => {
      setInventory((prev) => {
        const updated = prev.map((item) =>
          item.id === itemId
            ? { ...item, threshold: Math.max(1, Math.round(newThreshold)) }
            : item
        );
        broadcast("INVENTORY_UPDATE", updated);
        return updated;
      });
    },
    [broadcast]
  );

  const getLowStockItems = useCallback(() => {
    return inventory.filter((item) => item.stock <= item.threshold);
  }, [inventory]);

  const getOrdersByStatus = useCallback(
    (status) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  const lowStockItems = useMemo(
    () => inventory.filter((item) => item.stock <= item.threshold),
    [inventory]
  );

  const value = useMemo(
    () => ({
      orders,
      inventory,
      lowStockItems,
      isSyncing,
      refreshOrders,
      placeOrder: placeBackendOrder,
      placeBackendOrder,
      updateOrderStatus,
      cancelOrder,
      updateStock,
      updateInventoryStock: updateStock,
      restockItem,
      resetInventoryItem,
      updateThreshold,
      getLowStockItems,
      getOrdersByStatus,
    }),
    [
      orders,
      inventory,
      lowStockItems,
      isSyncing,
      refreshOrders,
      placeBackendOrder,
      updateOrderStatus,
      cancelOrder,
      updateStock,
      restockItem,
      resetInventoryItem,
      updateThreshold,
      getLowStockItems,
      getOrdersByStatus,
    ]
  );

  return (
    <OrderInventoryContext.Provider value={value}>
      {children}
    </OrderInventoryContext.Provider>
  );
}

export function useOrderInventory() {
  const context = useContext(OrderInventoryContext);
  if (!context) {
    throw new Error(
      "useOrderInventory must be used within an OrderInventoryProvider"
    );
  }
  return context;
}
