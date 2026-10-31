import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  User,
  ShoppingBag,
  Activity,
  DollarSign,
  ClipboardCheck,
  ChefHat,
  Truck,
  CheckCircle2,
  Check,
  Clock,
  Bike,
  ChevronDown,
  ChevronUp,
  Pizza,
  ArrowRight,
  Package,
  RotateCcw,
  XCircle,
  CalendarDays,
} from "lucide-react";
import { Button } from "../common/Button";
import { SectionHeader } from "../common/SectionHeader";
import { useOrderInventory } from "../../context/OrderInventoryContext";

// ─── Status helpers ──────────────────────────────────────────────
const ORDER_STAGES = [
  {
    key: "received",
    label: "Order Received",
    Icon: ClipboardCheck,
    description: "Your order has been confirmed",
  },
  {
    key: "kitchen",
    label: "In Kitchen",
    Icon: ChefHat,
    description: "Our chefs are preparing your pizza",
  },
  {
    key: "delivery",
    label: "Sent to Delivery",
    Icon: Truck,
    description: "Your order is on its way",
  },
  {
    key: "delivered",
    label: "Delivered",
    Icon: CheckCircle2,
    description: "Enjoy your meal!",
  },
];

const statusToStageIndex = (status) => {
  const map = {
    pending: 0,
    received: 0,
    confirmed: 0,
    preparing: 1,
    kitchen: 1,
    in_kitchen: 1,
    cooking: 1,
    ready: 2,
    delivery: 2,
    sent_to_delivery: 2,
    "out-for-delivery": 2,
    "out_for_delivery": 2,
    shipped: 2,
    delivered: 3,
  };
  return map[status?.toLowerCase()] ?? 0;
};

const progressPercent = (stageIdx) => [25, 50, 75, 100][stageIdx] ?? 0;

const minutesAgo = (dateStr) => {
  if (!dateStr) return 0;
  return Math.max(0, Math.round((Date.now() - new Date(dateStr).getTime()) / 60000));
};

const formatCurrency = (v) =>
  `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

// ─── Stat Card ───────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, shouldReduceMotion }) => (
  <motion.div
    initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-center gap-3 rounded-2xl bg-white border border-[#F3E8C8] px-4 py-3.5 shadow-sm"
  >
    <div
      className="flex items-center justify-center w-10 h-10 rounded-xl"
      style={{ backgroundColor: `${color}14` }}
    >
      <Icon size={20} style={{ color }} aria-hidden="true" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-[#7A5C55] font-medium leading-tight">{label}</p>
      <p className="text-lg font-bold text-[#351B17] font-['Poppins',sans-serif] leading-snug truncate">
        {value}
      </p>
    </div>
  </motion.div>
);

// ─── Stepper Stage ───────────────────────────────────────────────
const StepperStage = ({ stage, index, currentIdx, shouldReduceMotion }) => {
  const isCompleted = index < currentIdx;
  const isActive = index === currentIdx;
  const isUpcoming = index > currentIdx;

  let bgClass = "bg-gray-200";
  let textClass = "text-gray-400";
  if (isCompleted) {
    bgClass = "bg-[#941508]";
    textClass = "text-white";
  } else if (isActive) {
    bgClass = "bg-[#F49A13]";
    textClass = "text-white";
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      className="flex flex-col items-center text-center relative"
      aria-current={isActive ? "step" : undefined}
    >
      {/* Pulsating ring for active */}
      <div className="relative flex items-center justify-center">
        {isActive && !shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#F49A13]"
            animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
            style={{ width: 44, height: 44 }}
          />
        )}
        <span
          className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-full ${bgClass} ${textClass} transition-colors`}
        >
          {isCompleted ? (
            <Check size={20} aria-hidden="true" strokeWidth={3} />
          ) : (
            <stage.Icon size={20} aria-hidden="true" />
          )}
        </span>
      </div>

      <span
        className={`mt-2 text-xs font-semibold leading-tight ${
          isUpcoming ? "text-gray-400" : "text-[#351B17]"
        }`}
      >
        {stage.label}
      </span>
      <span
        className={`mt-0.5 text-[11px] leading-tight max-w-[110px] ${
          isUpcoming ? "text-gray-300" : "text-[#7A5C55]"
        }`}
      >
        {stage.description}
      </span>
    </motion.div>
  );
};

// ─── Connecting Line ─────────────────────────────────────────────
const ConnectingLine = ({ completed }) => (
  <div
    className={`hidden md:block flex-1 h-0.5 mx-1 self-[center_22px] mt-5 ${
      completed ? "bg-[#941508]" : "border-t-2 border-dashed border-gray-300 bg-transparent"
    }`}
    aria-hidden="true"
  />
);

// Vertical connecting line for mobile
const VerticalConnectingLine = ({ completed }) => (
  <div
    className={`md:hidden w-0.5 h-6 mx-auto ${
      completed ? "bg-[#941508]" : "border-l-2 border-dashed border-gray-300 bg-transparent"
    }`}
    aria-hidden="true"
  />
);

// ─── Active Order Tracker Card ───────────────────────────────────
const ActiveOrderTracker = ({ order, shouldReduceMotion }) => {
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const currentIdx = statusToStageIndex(order.status);
  const pct = progressPercent(currentIdx);
  const minsAgo = minutesAgo(order.createdAt || order.date);

  // Estimate ETA: ~30 min total from order, subtract elapsed
  const etaMinutes = Math.max(1, 30 - minsAgo);

  return (
    <motion.article
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white border border-[#F3E8C8] shadow-md overflow-hidden"
      aria-label={`Active order ${order.id}`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#351B17] font-['Poppins',sans-serif]">
            ORD-{String(order.id).slice(-5).padStart(5, "0")}
          </h3>
          <p className="text-xs text-[#7A5C55] flex items-center gap-1 mt-0.5">
            <Clock size={12} aria-hidden="true" />
            Placed {minsAgo} minute{minsAgo !== 1 ? "s" : ""} ago
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#F49A13]/15 text-[#B47400]">
          <Activity size={12} aria-hidden="true" />
          In Progress
        </span>
      </div>

      {/* 4‑Stage Stepper */}
      <div className="px-5 py-4">
        {/* Desktop horizontal */}
        <div className="hidden md:flex items-start justify-between" role="list" aria-label="Order progress steps">
          {ORDER_STAGES.map((stage, i) => (
            <React.Fragment key={stage.key}>
              <div role="listitem">
                <StepperStage
                  stage={stage}
                  index={i}
                  currentIdx={currentIdx}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
              {i < ORDER_STAGES.length - 1 && (
                <ConnectingLine completed={i < currentIdx} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="flex md:hidden flex-col items-center" role="list" aria-label="Order progress steps">
          {ORDER_STAGES.map((stage, i) => (
            <React.Fragment key={stage.key}>
              <div role="listitem">
                <StepperStage
                  stage={stage}
                  index={i}
                  currentIdx={currentIdx}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
              {i < ORDER_STAGES.length - 1 && (
                <VerticalConnectingLine completed={i < currentIdx} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Live Progress Bar */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-[#7A5C55]">Order Progress</span>
          <span className="text-[11px] font-bold text-[#941508]">{pct}%</span>
        </div>
        <div
          className="w-full h-2 rounded-full bg-gray-100 overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Order progress: ${pct}%`}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#941508] to-[#C92719]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.8, ease: "easeOut" }
            }
          />
        </div>
      </div>

      {/* ETA Card */}
      <div className="mx-5 mb-3 rounded-2xl bg-[#FFF9E6] border border-[#F3E8C8] px-4 py-3 flex items-center justify-between gap-3">
        <div role="status" aria-live="polite">
          <p className="text-xs text-[#7A5C55] font-medium">Estimated Delivery</p>
          <p className="text-lg font-bold text-[#351B17] font-['Poppins',sans-serif]">
            ~{etaMinutes} min{etaMinutes !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[11px] text-[#7A5C55]">Your rider</p>
            <p className="text-xs font-semibold text-[#351B17]">Marco V.</p>
          </div>
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#941508]/10">
            <Bike size={18} className="text-[#941508]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Order Items Summary (collapsible) */}
      <div className="border-t border-[#F3E8C8]">
        <button
          onClick={() => setItemsExpanded((p) => !p)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-[#351B17] hover:bg-[#FFFDF7] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] focus-visible:ring-inset"
          aria-expanded={itemsExpanded}
        >
          <span className="flex items-center gap-2">
            <Package size={15} aria-hidden="true" className="text-[#7A5C55]" />
            Order Items ({order.items?.length || 0})
          </span>
          {itemsExpanded ? (
            <ChevronUp size={16} aria-hidden="true" />
          ) : (
            <ChevronDown size={16} aria-hidden="true" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {itemsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }
              }
              className="overflow-hidden"
            >
              <ul className="px-5 pb-4 space-y-2.5">
                {(order.items || []).map((item, idx) => (
                  <li
                    key={item.cartKey || item.id || idx}
                    className="flex items-center gap-3 rounded-xl bg-[#FFFDF7] p-2.5"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#351B17] truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#7A5C55]">
                        {item.size && <span>{item.size} · </span>}
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#941508] whitespace-nowrap">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

// ─── Order History Card ──────────────────────────────────────────
const OrderHistoryCard = ({ order, onReorder, shouldReduceMotion }) => {
  const isDelivered =
    order.status?.toLowerCase() === "delivered" ||
    order.status?.toLowerCase() === "completed";
  const isCancelled = order.status?.toLowerCase() === "cancelled";

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35 }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl bg-white border border-[#F3E8C8] px-4 py-3.5 shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 ${
            isCancelled ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          {isCancelled ? (
            <XCircle size={18} className="text-red-500" aria-hidden="true" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-600" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#351B17] font-['Poppins',sans-serif]">
            ORD-{String(order.id).slice(-5).padStart(5, "0")}
          </p>
          <p className="text-[11px] text-[#7A5C55] flex items-center gap-1">
            <CalendarDays size={11} aria-hidden="true" />
            {formatDate(order.createdAt || order.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="text-xs text-[#7A5C55]">
          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
        </span>
        <span className="text-sm font-bold text-[#351B17]">
          {formatCurrency(order.total)}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            isCancelled
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {isCancelled ? "Cancelled" : "Delivered"}
        </span>
        {isDelivered && onReorder && (
          <Button
            size="sm"
            variant="outline"
            icon={RotateCcw}
            onClick={() => onReorder(order)}
            aria-label={`Reorder order ORD-${String(order.id).slice(-5).padStart(5, "0")}`}
            className="!min-h-[36px] !py-1 !text-xs"
          >
            Reorder
          </Button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────
const EmptyState = ({ shouldReduceMotion }) => (
  <motion.div
    initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
  >
    <div className="flex items-center justify-center w-28 h-28 rounded-full bg-[#FFF0B8] mb-6">
      <Pizza size={48} className="text-[#F49A13]" aria-hidden="true" />
    </div>
    <h2 className="text-2xl font-bold text-[#351B17] font-['Poppins',sans-serif] mb-2">
      No orders yet!
    </h2>
    <p className="text-sm text-[#7A5C55] max-w-sm mb-6">
      Browse our menu and place your first order. Delicious pizza is just a click away!
    </p>
    <Button
      variant="primary"
      size="lg"
      icon={ArrowRight}
      onClick={() => {
        window.location.hash = "#menu";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label="Explore menu"
    >
      Explore Menu
    </Button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════
export const UserDashboard = () => {
  const shouldReduceMotion = useReducedMotion();
  const { orders } = useOrderInventory();

  // Separate active from past orders
  const { activeOrders, pastOrders, totalSpent } = useMemo(() => {
    const active = [];
    const past = [];
    let spent = 0;

    (orders || []).forEach((o) => {
      const s = o.status?.toLowerCase();
      if (s === "delivered" || s === "completed" || s === "cancelled") {
        past.push(o);
        if (s !== "cancelled") spent += Number(o.total || 0);
      } else {
        active.push(o);
      }
    });

    // Sort past: newest first
    past.sort(
      (a, b) =>
        new Date(b.createdAt || b.date || 0).getTime() -
        new Date(a.createdAt || a.date || 0).getTime()
    );

    return { activeOrders: active, pastOrders: past, totalSpent: spent };
  }, [orders]);

  const totalOrders = (orders || []).length;

  // Reorder handler — adds all items from a past order back to context
  const handleReorder = (order) => {
    if (!order.items?.length) return;
    // Navigate to menu or trigger cart re‑add via context (placeholder — integrates with actual cart)
    window.location.hash = "#menu";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Empty state ──
  if (!orders || orders.length === 0) {
    return (
      <section
        className="min-h-screen bg-[#FFFDF7] pt-24 pb-16 px-4"
        aria-label="User dashboard"
      >
        <div className="mx-auto max-w-5xl">
          <EmptyState shouldReduceMotion={shouldReduceMotion} />
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-[#FFFDF7] pt-24 pb-16 px-4"
      aria-label="User dashboard"
    >
      <div className="mx-auto max-w-5xl space-y-8">
        {/* ── Welcome Header ── */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#941508]">
              <User size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#351B17] font-['Poppins',sans-serif] leading-tight">
                Welcome back!
              </h1>
              <p className="text-xs text-[#7A5C55]">Here's what's happening with your orders</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={totalOrders}
              color="#941508"
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatCard
              icon={Activity}
              label="Active Orders"
              value={activeOrders.length}
              color="#F49A13"
              shouldReduceMotion={shouldReduceMotion}
            />
            <StatCard
              icon={DollarSign}
              label="Total Spent"
              value={formatCurrency(totalSpent)}
              color="#0D9C5C"
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        </motion.div>

        {/* ── Active Order Trackers ── */}
        {activeOrders.length > 0 && (
          <div className="space-y-5">
            <SectionHeader
              title="Active Orders"
              subtitle="Track your orders in real-time"
              centered={false}
            />

            {activeOrders.map((order) => (
              <ActiveOrderTracker
                key={order.id}
                order={order}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        )}

        {/* ── Order History ── */}
        {pastOrders.length > 0 && (
          <div className="space-y-4">
            <SectionHeader
              title="Order History"
              subtitle="Your past orders and deliveries"
              centered={false}
            />

            <div className="space-y-3">
              {pastOrders.map((order) => (
                <OrderHistoryCard
                  key={order.id}
                  order={order}
                  onReorder={handleReorder}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserDashboard;
