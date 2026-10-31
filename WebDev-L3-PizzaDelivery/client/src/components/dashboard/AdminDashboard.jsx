import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ShieldCheck,
  ClipboardList,
  Clock,
  AlertTriangle,
  DollarSign,
  Package,
  ChefHat,
  Truck,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RotateCcw,
  Sliders,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Check,
  Edit2,
  Send,
  X,
  BellRing,
  RefreshCw,
} from "lucide-react";
import { Button } from "../common/Button";
import { SectionHeader } from "../common/SectionHeader";
import { useOrderInventory } from "../../context/OrderInventoryContext";

// ─── Status Visual Configurations ──────────────────────────────────────────
const STATUS_CONFIG = {
  received: {
    label: "Order Received",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    dotColor: "bg-amber-500",
    nextStatus: "in_kitchen",
    nextLabel: "Move to Kitchen",
    nextIcon: ChefHat,
    nextVariant: "accent",
  },
  in_kitchen: {
    label: "In Kitchen",
    badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
    dotColor: "bg-orange-500",
    nextStatus: "sent_to_delivery",
    nextLabel: "Dispatch Delivery",
    nextIcon: Truck,
    nextVariant: "secondary",
  },
  sent_to_delivery: {
    label: "Out for Delivery",
    badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
    dotColor: "bg-blue-500",
    nextStatus: "delivered",
    nextLabel: "Mark Delivered",
    nextIcon: CheckCircle2,
    nextVariant: "primary",
  },
  delivered: {
    label: "Delivered",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
    dotColor: "bg-emerald-500",
    nextStatus: null,
  },
  cancelled: {
    label: "Cancelled",
    badgeBg: "bg-red-100 text-red-900 border-red-300",
    dotColor: "bg-red-500",
    nextStatus: null,
  },
};

const CATEGORY_COLORS = {
  "Pizza Bases": {
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    iconBg: "bg-amber-100 text-amber-800",
  },
  Sauces: {
    bg: "bg-red-50 text-red-800 border-red-200",
    iconBg: "bg-red-100 text-red-800",
  },
  Cheeses: {
    bg: "bg-yellow-50 text-yellow-800 border-yellow-200",
    iconBg: "bg-yellow-100 text-yellow-800",
  },
  Vegetables: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-800",
  },
};

const minutesAgo = (dateStr) => {
  if (!dateStr) return "Just now";
  const mins = Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 60000));
  if (mins === 0) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
};

export const AdminDashboard = () => {
  const shouldReduceMotion = useReducedMotion();
  const {
    orders,
    inventory,
    updateOrderStatus,
    cancelOrder,
    updateStock,
    updateThreshold,
    restockItem,
    getLowStockItems,
  } = useOrderInventory();

  // Active Tab: "orders" | "inventory"
  const [activeTab, setActiveTab] = useState("orders");

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState("all");
  const [searchOrderQuery, setSearchOrderQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Inventory Filter & Editing
  const [inventoryCategory, setInventoryCategory] = useState("all");
  const [editingThresholdId, setEditingThresholdId] = useState(null);
  const [tempThresholdValue, setTempThresholdValue] = useState("");
  const [directStockInput, setDirectStockInput] = useState({});

  // Email Notification Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSimulationSent, setEmailSimulationSent] = useState(false);

  const lowStockItems = useMemo(() => getLowStockItems(), [inventory, getLowStockItems]);

  // KPI Calculations
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter =
        orderFilter === "all"
          ? true
          : orderFilter === "active"
          ? o.status !== "delivered" && o.status !== "cancelled"
          : o.status === orderFilter;
      const matchesSearch =
        !searchOrderQuery ||
        o.id.toLowerCase().includes(searchOrderQuery.toLowerCase()) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchOrderQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [orders, orderFilter, searchOrderQuery]);

  // Grouped Inventory
  const categories = ["Pizza Bases", "Sauces", "Cheeses", "Vegetables"];

  const filteredCategories =
    inventoryCategory === "all" ? categories : [inventoryCategory];

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setIsEmailModalOpen(false);
      }
    };
    if (isEmailModalOpen) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [isEmailModalOpen]);

  const handleSaveThreshold = (itemId) => {
    const val = parseInt(tempThresholdValue, 10);
    if (!isNaN(val) && val >= 0) {
      updateThreshold(itemId, val);
    }
    setEditingThresholdId(null);
  };

  const handleDirectStockSubmit = (itemId) => {
    const val = parseFloat(directStockInput[itemId]);
    if (!isNaN(val) && val >= 0) {
      updateStock(itemId, val);
    }
    setDirectStockInput((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  return (
    <div className="pt-24 pb-20 bg-[#FFFDF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0B8] border border-[#E8D595] text-[#941508] text-xs font-bold mb-2">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Kitchen &amp; Operations Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#351B17] tracking-tight">
              Admin <span className="text-[#941508]">Dashboard</span>
            </h1>
            <p className="text-sm text-[#7A5C55] mt-1">
              Live order orchestration, real-time inventory levels, and automated stock alerts.
            </p>
          </div>

          {/* Quick tab switcher pill */}
          <div
            className="flex items-center bg-white p-1 rounded-full border border-[#E8D595] shadow-xs self-start md:self-auto"
            role="tablist"
            aria-label="Admin Navigation Tabs"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "orders"}
              aria-controls="orders-tabpanel"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer min-h-[40px] ${
                activeTab === "orders"
                  ? "bg-[#941508] text-white shadow-xs"
                  : "text-[#351B17] hover:bg-[#FFF0B8]/50"
              }`}
            >
              <ClipboardList size={15} aria-hidden="true" />
              <span>Incoming Orders</span>
              {activeOrdersCount > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    activeTab === "orders" ? "bg-white/20 text-white" : "bg-[#941508] text-white"
                  }`}
                >
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "inventory"}
              aria-controls="inventory-tabpanel"
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer min-h-[40px] ${
                activeTab === "inventory"
                  ? "bg-[#941508] text-white shadow-xs"
                  : "text-[#351B17] hover:bg-[#FFF0B8]/50"
              }`}
            >
              <Package size={15} aria-hidden="true" />
              <span>Inventory Stock</span>
              {lowStockItems.length > 0 && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-red-600 text-white animate-pulse">
                  {lowStockItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4 KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white rounded-2xl border border-[#E8D595]/60 shadow-xs flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#941508] flex items-center justify-center shrink-0">
              <ClipboardList size={22} aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#7A5C55] block">Total Orders</span>
              <span className="text-2xl font-black text-[#351B17] leading-tight">
                {totalOrdersCount}
              </span>
            </div>
          </motion.div>

          {/* Active Orders */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 bg-white rounded-2xl border border-[#E8D595]/60 shadow-xs flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Clock size={22} aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#7A5C55] block">Active Orders</span>
              <span className="text-2xl font-black text-orange-600 leading-tight">
                {activeOrdersCount}
              </span>
            </div>
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-2xl border shadow-xs flex items-center gap-3.5 transition-colors ${
              lowStockItems.length > 0
                ? "bg-red-50/70 border-red-300"
                : "bg-white border-[#E8D595]/60"
            }`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                lowStockItems.length > 0
                  ? "bg-red-500 text-white"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <AlertTriangle size={22} aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#7A5C55] block">Stock Alerts</span>
              <span
                className={`text-2xl font-black leading-tight ${
                  lowStockItems.length > 0 ? "text-red-600" : "text-emerald-700"
                }`}
              >
                {lowStockItems.length} Low
              </span>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 bg-white rounded-2xl border border-[#E8D595]/60 shadow-xs flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign size={22} aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#7A5C55] block">Delivered Revenue</span>
              <span className="text-2xl font-black text-emerald-700 leading-tight">
                ${totalRevenue.toFixed(2)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ─── TAB 1: ORDER MANAGEMENT PANEL ────────────────────────────── */}
        {activeTab === "orders" && (
          <div id="orders-tabpanel" role="tabpanel" aria-label="Order Management">
            {/* Filter Bar & Search */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8D595] shadow-xs mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Status filter buttons */}
              <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Filter orders">
                {[
                  { key: "all", label: "All Orders" },
                  { key: "active", label: "Active Queue" },
                  { key: "received", label: "Received" },
                  { key: "in_kitchen", label: "In Kitchen" },
                  { key: "sent_to_delivery", label: "Out for Delivery" },
                  { key: "delivered", label: "Delivered" },
                  { key: "cancelled", label: "Cancelled" },
                ].map((tab) => {
                  const isActive = orderFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setOrderFilter(tab.key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                        isActive
                          ? "bg-[#941508] text-white shadow-2xs"
                          : "bg-gray-50 text-[#7A5C55] hover:bg-[#FFF0B8]/60 hover:text-[#351B17] border border-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search by Order ID or Name..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-gray-200 bg-[#FFFDF7] text-[#351B17] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#941508]"
                />
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#E8D595]">
                <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#351B17]">No Orders Found</h3>
                <p className="text-xs text-[#7A5C55] mt-1">
                  Try adjusting your filter or search query.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
                  const NextIcon = cfg.nextIcon;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-[#E8D595]/80 shadow-xs hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Main Summary Header Row */}
                      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left: ID & Customer */}
                        <div className="flex items-start gap-3.5">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrderId(isExpanded ? null : order.id)
                            }
                            className="p-1 rounded-lg text-gray-400 hover:text-[#941508] hover:bg-gray-100 transition-colors mt-0.5"
                            aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-black text-base text-[#351B17]">
                                {order.id}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${cfg.badgeBg}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                                {cfg.label}
                              </span>
                              <span className="text-xs text-[#7A5C55]">
                                • {minutesAgo(order.createdAt)}
                              </span>
                            </div>

                            <p className="text-xs text-[#7A5C55] mt-1">
                              Customer:{" "}
                              <strong className="text-[#351B17]">
                                {order.customerName || "Walk-in Guest"}
                              </strong>{" "}
                              • {order.items?.length || 0} items (${Number(order.total || 0).toFixed(2)})
                            </p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                          {/* Advance Status Button */}
                          {cfg.nextStatus && (
                            <Button
                              variant={cfg.nextVariant || "primary"}
                              size="sm"
                              icon={NextIcon}
                              onClick={() => updateOrderStatus(order.id, cfg.nextStatus)}
                            >
                              {cfg.nextLabel}
                            </Button>
                          )}

                          {/* Cancel Order (if active) */}
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              icon={XCircle}
                              onClick={() => cancelOrder(order.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Order Details Panel */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-gray-100 bg-[#FFFDF7]/60 px-5 py-4 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Items list */}
                              <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-[#941508] mb-2.5">
                                  Ordered Pizzas &amp; Items
                                </h4>
                                <div className="space-y-2">
                                  {order.items?.map((it, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-gray-100"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        {it.image && (
                                          <img
                                            src={it.image}
                                            alt=""
                                            className="w-8 h-8 rounded-full object-cover border"
                                          />
                                        )}
                                        <div>
                                          <p className="font-bold text-[#351B17]">
                                            {it.name}{" "}
                                            <span className="text-[10px] text-gray-500 font-normal">
                                              ({it.size || "Medium"})
                                            </span>
                                          </p>
                                          <p className="text-[11px] text-[#7A5C55]">
                                            Qty: {it.quantity} × ${Number(it.price).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-black text-[#351B17]">
                                        ${(it.quantity * it.price).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Delivery & Timeline */}
                              <div className="space-y-3">
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-[#941508] mb-1.5">
                                    Delivery Destination
                                  </h4>
                                  <p className="text-xs text-[#351B17] bg-white p-2.5 rounded-xl border border-gray-100">
                                    {order.deliveryAddress || "123 Main Street, Apt 4B"}
                                  </p>
                                </div>

                                {/* Status Timeline History */}
                                <div>
                                  <h4 className="text-xs font-black uppercase tracking-wider text-[#941508] mb-1.5">
                                    Status Timeline
                                  </h4>
                                  <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-gray-100 text-xs">
                                    {order.statusHistory?.map((h, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center justify-between text-[11px]"
                                      >
                                        <span className="font-semibold text-[#351B17] capitalize">
                                          {h.status?.replace(/_/g, " ")}
                                        </span>
                                        <span className="text-gray-400">
                                          {new Date(h.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: INVENTORY MANAGEMENT DASHBOARD ────────────────────── */}
        {activeTab === "inventory" && (
          <div id="inventory-tabpanel" role="tabpanel" aria-label="Inventory Management">
            {/* Low Stock Alert Banner (conditional) */}
            {lowStockItems.length > 0 && (
              <motion.div
                initial={shouldReduceMotion ? {} : { scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 mb-8 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <AlertTriangle size={22} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-red-950">
                        {lowStockItems.length} Ingredients Under Threshold Warning!
                      </h3>
                      <p className="text-xs text-red-800 mt-0.5">
                        Items requiring immediate replenishment:{" "}
                        <strong className="underline">
                          {lowStockItems.map((i) => i.name).join(", ")}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Mail}
                    onClick={() => setIsEmailModalOpen(true)}
                  >
                    Simulate Email Alert
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Inventory Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Filter Inventory">
                <button
                  type="button"
                  onClick={() => setInventoryCategory("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                    inventoryCategory === "all"
                      ? "bg-[#941508] text-white shadow-xs"
                      : "bg-white text-[#7A5C55] hover:bg-[#FFF0B8]/50 border border-[#E8D595]"
                  }`}
                >
                  All Categories ({inventory.length})
                </button>
                {categories.map((cat) => {
                  const count = inventory.filter((i) => i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInventoryCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                        inventoryCategory === cat
                          ? "bg-[#941508] text-white shadow-xs"
                          : "bg-white text-[#7A5C55] hover:bg-[#FFF0B8]/50 border border-[#E8D595]"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Configure Alerts CTA */}
              <Button
                variant="outline"
                size="sm"
                icon={Sliders}
                onClick={() => setIsEmailModalOpen(true)}
              >
                Configure Thresholds &amp; Alerts
              </Button>
            </div>

            {/* Inventory Groups */}
            <div className="space-y-8">
              {filteredCategories.map((cat) => {
                const items = inventory.filter((i) => i.category === cat);
                const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS["Pizza Bases"];

                return (
                  <div key={cat} className="space-y-3">
                    {/* Category Title */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${colors.bg}`}>
                        {cat}
                      </span>
                      <span className="text-xs text-[#7A5C55]">({items.length} ingredients)</span>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {items.map((item) => {
                        const isLowStock = item.stock <= item.threshold;
                        const isModerate =
                          !isLowStock && item.stock <= item.threshold * 2.5;

                        // Visual bar max
                        const maxBar = Math.max(item.threshold * 4, 120);
                        const barPercent = Math.min(100, Math.round((item.stock / maxBar) * 100));

                        const isEditingThreshold = editingThresholdId === item.id;

                        return (
                          <div
                            key={item.id}
                            className={`p-4 bg-white rounded-2xl border transition-all ${
                              isLowStock
                                ? "border-red-400 shadow-sm bg-red-50/20"
                                : "border-[#E8D595]/70 hover:border-[#941508]/40 hover:shadow-sm"
                            }`}
                          >
                            {/* Card Top: Name & Status Pill */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-bold text-sm text-[#351B17] leading-tight">
                                  {item.name}
                                </h4>
                                <span className="text-[10px] text-gray-400">ID: {item.id}</span>
                              </div>

                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  isLowStock
                                    ? "bg-red-100 text-red-700 animate-pulse border border-red-300"
                                    : isModerate
                                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {isLowStock
                                  ? "Low Stock!"
                                  : isModerate
                                  ? "Moderate"
                                  : "Healthy"}
                              </span>
                            </div>

                            {/* Stock Display & Visual Bar */}
                            <div className="my-3">
                              <div className="flex items-baseline justify-between mb-1">
                                <span className="text-xl font-black text-[#351B17]">
                                  {item.stock}{" "}
                                  <span className="text-xs font-normal text-gray-500">
                                    {item.unit}
                                  </span>
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  alert &lt; {item.threshold} {item.unit}
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div
                                className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
                                role="progressbar"
                                aria-valuenow={item.stock}
                                aria-valuemin={0}
                                aria-valuemax={maxBar}
                              >
                                <motion.div
                                  initial={shouldReduceMotion ? {} : { width: 0 }}
                                  animate={{ width: `${barPercent}%` }}
                                  transition={{ duration: 0.5 }}
                                  className={`h-full rounded-full transition-colors ${
                                    isLowStock
                                      ? "bg-red-600"
                                      : isModerate
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Manual Controls Toolbar */}
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                              {/* - / + controls and direct stock edit */}
                              <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => updateStock(item.id, Math.max(0, item.stock - 1))}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#351B17] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                                    aria-label={`Decrease ${item.name} stock by 1`}
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateStock(item.id, item.stock + 1)}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#351B17] flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                                    aria-label={`Increase ${item.name} stock by 1`}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                {/* Quick Restock +20 */}
                                <button
                                  type="button"
                                  onClick={() => restockItem(item.id, 20)}
                                  className="px-2.5 py-1 rounded-lg bg-[#FFF0B8] hover:bg-[#F49A13] hover:text-white text-[#941508] text-[11px] font-extrabold border border-[#E8D595] cursor-pointer transition-colors"
                                >
                                  +20 Restock
                                </button>
                              </div>

                              {/* Threshold inline editor */}
                              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                                {isEditingThreshold ? (
                                  <div className="flex items-center gap-1 w-full">
                                    <span className="text-[10px]">Min:</span>
                                    <input
                                      type="number"
                                      value={tempThresholdValue}
                                      onChange={(e) => setTempThresholdValue(e.target.value)}
                                      className="w-16 px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white text-center"
                                      autoFocus
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveThreshold(item.id)}
                                      className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                      aria-label="Save threshold"
                                    >
                                      <Check size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingThresholdId(null)}
                                      className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
                                      aria-label="Cancel threshold editing"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span>Threshold: {item.threshold} {item.unit}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingThresholdId(item.id);
                                        setTempThresholdValue(item.threshold.toString());
                                      }}
                                      className="inline-flex items-center gap-0.5 text-[#941508] hover:underline cursor-pointer"
                                    >
                                      <Edit2 size={10} />
                                      <span>Edit</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── AUTOMATED EMAIL NOTIFICATION SIMULATION MODAL ────────────── */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-modal-title"
          >
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8D595] relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsEmailModalOpen(false);
                  setEmailSimulationSent(false);
                }}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-[#351B17] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Title */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0B8] text-[#941508] flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 id="email-modal-title" className="text-xl font-black text-[#351B17]">
                    Automated Low-Stock Email Notifications
                  </h3>
                  <p className="text-xs text-[#7A5C55]">
                    Simulated background scheduled job (`node-cron` worker integration ready)
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 my-4 pr-1">
                {/* Description */}
                <div className="p-3.5 bg-[#FFFDF7] rounded-2xl border border-[#E8D595] text-xs text-[#7A5C55] leading-relaxed">
                  Whenever an item's stock drops below its designated minimum threshold, PizzaCrave's automated scheduler generates a priority digest and alerts the culinary management team.
                </div>

                {/* Email Preview Card */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-[#941508] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <BellRing size={14} />
                      Email Digest Preview: admin@pizzacrave.com
                    </span>
                    <span className="text-[11px] opacity-80">Automated Alert</span>
                  </div>

                  <div className="p-4 bg-white text-xs space-y-3">
                    <div className="border-b pb-2 text-[11px] text-gray-500">
                      <p><strong>From:</strong> alerts@pizzacrave-ops.internal</p>
                      <p><strong>To:</strong> kitchen-admin@pizzacrave.com</p>
                      <p><strong>Subject:</strong> ⚠️ URGENT: Low Ingredient Inventory Warning ({lowStockItems.length} items)</p>
                    </div>

                    <p className="text-[#351B17] font-semibold">
                      Hello PizzaCrave Kitchen Manager,
                    </p>
                    <p className="text-[#7A5C55]">
                      The automatic inventory health check has detected the following ingredients falling below their critical thresholds:
                    </p>

                    <div className="bg-red-50 p-3 rounded-xl border border-red-200 space-y-1.5">
                      {lowStockItems.length === 0 ? (
                        <p className="text-emerald-700 font-bold">
                          ✓ All inventory items are currently above threshold levels. No replenishment required!
                        </p>
                      ) : (
                        lowStockItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-[11px] text-red-900"
                          >
                            <span className="font-bold">• {item.name} ({item.category})</span>
                            <span className="font-black">
                              Current: {item.stock} {item.unit} (Threshold: {item.threshold} {item.unit})
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <p className="text-[11px] text-gray-400">
                      This alert is evaluated by node-cron every 15 minutes and immediately following checkout stock decrements.
                    </p>
                  </div>
                </div>

                {/* Simulation trigger message */}
                {emailSimulationSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold"
                  >
                    <CheckCircle2 size={16} />
                    <span>Automated alert simulation triggered successfully! In a live node-cron environment, nodemailer / Resend dispatches this payload.</span>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    setEmailSimulationSent(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={() => setEmailSimulationSent(true)}
                >
                  Test Fire Alert Now
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
