import React, { useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  RefreshCw,
  CreditCard,
  Camera,
  Upload,
  Trash2,
  Edit3,
  X,
} from "lucide-react";
import { Button } from "../common/Button";
import { SectionHeader } from "../common/SectionHeader";
import { useOrderInventory } from "../../context/OrderInventoryContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createCheckoutSession } from "../../services/paymentServices";
import { updateUserProfile } from "../../services/authServices";
import { uploadProfilePhoto } from "../../config/firebase";

// Profile Photo Management Component
const ProfilePhotoManager = ({ user, updateUser, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const isDefaultAvatar = user?.photoURL?.includes("ui-avatars.com");

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showToast("Please select a valid image (JPEG, PNG, WebP, GIF)", "error");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast("Image must be under 5MB", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const downloadURL = await uploadProfilePhoto(file, user._id || user.id);
      setUploadProgress(70);

      const response = await updateUserProfile({ photoURL: downloadURL });
      setUploadProgress(90);

      updateUser({ photoURL: response.data?.photoURL || downloadURL });
      setUploadProgress(100);
      showToast("Profile photo updated!", "success");
      setIsOpen(false);
    } catch (error) {
      showToast(error.message || "Failed to upload photo", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (isDefaultAvatar) return;

    setIsUploading(true);
    try {
      const response = await updateUserProfile({ photoURL: "remove" });
      updateUser({ photoURL: response.data?.photoURL });
      showToast("Photo removed. Default avatar applied.", "success");
      setIsOpen(false);
    } catch (error) {
      showToast(error.message || "Failed to remove photo", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "P";

  return (
    <>
      {/* Avatar with edit button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative group cursor-pointer"
        title="Change profile photo"
      >
        <div className="w-11 h-11 rounded-full bg-[#941508] flex items-center justify-center overflow-hidden text-white text-base font-bold">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name || "Profile"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerText = userInitial;
              }}
            />
          ) : (
            userInitial
          )}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#F49A13] rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
          <Camera size={8} className="text-white" />
        </div>
      </button>

      {/* Photo Management Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isUploading) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8D595]/50">
                <h3 className="text-base font-bold text-[#351B17] font-['Poppins',sans-serif]">
                  Profile Photo
                </h3>
                <button
                  type="button"
                  onClick={() => !isUploading && setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-[#FFF0B8] transition-colors cursor-pointer"
                  disabled={isUploading}
                >
                  <X size={18} className="text-[#7A5C55]" />
                </button>
              </div>

              {/* Current Photo Preview */}
              <div className="flex flex-col items-center py-6 px-5">
                <div className="w-24 h-24 rounded-full bg-[#941508] flex items-center justify-center overflow-hidden text-white text-3xl font-bold mb-4 ring-4 ring-[#E8D595]/40">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name || "Profile"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.innerText = userInitial;
                      }}
                    />
                  ) : (
                    userInitial
                  )}
                </div>
                <p className="text-sm font-semibold text-[#351B17]">{user?.name}</p>
                <p className="text-xs text-[#7A5C55] mt-0.5">{user?.email}</p>

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && (
                  <div className="w-full mt-4">
                    <div className="h-1.5 bg-[#FFF0B8] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#941508] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-[#7A5C55] text-center mt-1.5">Uploading...</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 space-y-2.5">
                {/* Upload Button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#941508] text-white text-sm font-bold rounded-xl hover:bg-[#7a1107] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Upload size={16} />
                  <span>{isDefaultAvatar ? "Upload Photo" : "Change Photo"}</span>
                </button>

                {/* Remove Button (only if custom photo) */}
                {!isDefaultAvatar && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#941508] text-sm font-bold rounded-xl border border-[#E8D595] hover:bg-[#FFF0B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 size={16} />
                    <span>Remove Photo</span>
                  </button>
                )}

                <p className="text-[10px] text-[#7A5C55] text-center pt-1">
                  JPEG, PNG, WebP, or GIF • Max 5MB
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

//  Status helpers 
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

//  Stat Card 
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

//  Stepper Stage 
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
        className={`mt-2 text-xs font-semibold leading-tight ${isUpcoming ? "text-gray-400" : "text-[#351B17]"
          }`}
      >
        {stage.label}
      </span>
      <span
        className={`mt-0.5 text-[11px] leading-tight max-w-[110px] ${isUpcoming ? "text-gray-300" : "text-[#7A5C55]"
          }`}
      >
        {stage.description}
      </span>
    </motion.div>
  );
};

//  Connecting Line 
const ConnectingLine = ({ completed }) => (
  <div
    className={`hidden md:block flex-1 h-0.5 mx-1 self-[center_22px] mt-5 ${completed ? "bg-[#941508]" : "border-t-2 border-dashed border-gray-300 bg-transparent"
      }`}
    aria-hidden="true"
  />
);

// Vertical connecting line for mobile
const VerticalConnectingLine = ({ completed }) => (
  <div
    className={`md:hidden w-0.5 h-6 mx-auto ${completed ? "bg-[#941508]" : "border-l-2 border-dashed border-gray-300 bg-transparent"
      }`}
    aria-hidden="true"
  />
);

// Active Order Tracker Card 
const ActiveOrderTracker = ({ order, shouldReduceMotion, onCancel, onPayStripe }) => {
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const currentIdx = statusToStageIndex(order.status);
  const pct = progressPercent(currentIdx);
  const minsAgo = minutesAgo(order.createdAt || order.date);

  // Estimate ETA: ~30 min total from order, subtract elapsed
  const etaMinutes = Math.max(1, 30 - minsAgo);

  const displayId = String(order.id || order._id).startsWith("ORD-")
    ? order.id
    : `ORD-${String(order.id || order._id).slice(-6).toUpperCase()}`;

  const isStripePending =
    order.paymentMethod === "Stripe" && order.paymentStatus === "Pending";
  const isPaid = order.paymentStatus === "Completed";

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
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#351B17] font-['Poppins',sans-serif]">
              {displayId}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-[#7A5C55]">
              {order.paymentMethod || "COD"}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : order.paymentStatus === "Failed"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {isPaid ? "Paid" : order.paymentStatus || "Pending"}
            </span>
          </div>
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
        {/* Actions (Pay Now & Cancel Order) */}
        {(isStripePending || (onCancel && !isPaid)) && (
          <div className="px-5 pt-4 flex flex-wrap items-center justify-between gap-2">
            {isStripePending && onPayStripe ? (
              <Button
                size="sm"
                variant="primary"
                icon={CreditCard}
                onClick={() => onPayStripe(order._id || order.id)}
              >
                Pay with Stripe ({formatCurrency(order.total)})
              </Button>
            ) : <div />}

            {onCancel && !isPaid && (
              <Button
                size="sm"
                variant="outline"
                icon={XCircle}
                onClick={() => onCancel(order._id || order.id)}
                className="!text-red-600 !border-red-200 hover:!bg-red-50 ml-auto"
              >
                Cancel Order
              </Button>
            )}
          </div>
        )}
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

//  Order History Card 
const OrderHistoryCard = ({ order, onReorder, shouldReduceMotion, onPayStripe }) => {
  const isDelivered =
    order.status?.toLowerCase() === "delivered" ||
    order.status?.toLowerCase() === "completed";
  const isCancelled = order.status?.toLowerCase() === "cancelled";
  const isStripePending =
    order.paymentMethod === "Stripe" && order.paymentStatus === "Pending";
  const isPaid = order.paymentStatus === "Completed";

  const displayId = String(order.id || order._id).startsWith("ORD-")
    ? order.id
    : `ORD-${String(order.id || order._id).slice(-6).toUpperCase()}`;

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
          className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 ${isCancelled ? "bg-red-50" : "bg-emerald-50"
            }`}
        >
          {isCancelled ? (
            <XCircle size={18} className="text-red-500" aria-hidden="true" />
          ) : (
            <CheckCircle2 size={18} className="text-emerald-600" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[#351B17] font-['Poppins',sans-serif]">
              {displayId}
            </p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-[#7A5C55]">
              {order.paymentMethod || "COD"}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isPaid
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : order.paymentStatus === "Failed"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {isPaid ? "Paid" : order.paymentStatus || "Pending"}
            </span>
          </div>
          <p className="text-[11px] text-[#7A5C55] flex items-center gap-1 mt-0.5">
            <CalendarDays size={11} aria-hidden="true" />
            {formatDate(order.createdAt || order.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-[#7A5C55]">
          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
        </span>
        <span className="text-sm font-bold text-[#351B17]">
          {formatCurrency(order.total)}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${isCancelled
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
        >
          {isCancelled ? "Cancelled" : "Delivered"}
        </span>

        {isStripePending && !isCancelled && onPayStripe && (
          <Button
            size="sm"
            variant="primary"
            icon={CreditCard}
            onClick={() => onPayStripe(order._id || order.id)}
            className="!min-h-[36px] !py-1 !text-xs"
          >
            Pay Now
          </Button>
        )}

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

// Empty State 
const EmptyState = ({ shouldReduceMotion, onExploreMenu }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (onExploreMenu) {
      onExploreMenu();
    } else {
      navigate("/#menu");
    }
  };

  return (
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
        onClick={handleExplore}
        aria-label="Explore menu"
      >
        Explore Menu
      </Button>
    </motion.div>
  );
};

// Main Component
export const UserDashboard = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { orders, isSyncing, refreshOrders, cancelOrder } = useOrderInventory();
  const { user, updateUser } = useAuth();
  const { showToast } = useCart();

  // Backend already returns only the logged-in user's orders
  const userOrders = useMemo(() => orders || [], [orders]);

  // Separate active from past orders
  const { activeOrders, pastOrders, totalSpent } = useMemo(() => {
    const active = [];
    const past = [];
    let spent = 0;

    (userOrders || []).forEach((o) => {
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
  }, [userOrders]);

  const totalOrders = (userOrders || []).length;
  //Cancle Customer own order
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    const result = await cancelOrder(orderId);

    if (!result.success) {
      window.alert(result.message || "Failed to cancel order.");
      return;
    }

    window.alert("Your order has been cancelled successfully.");
  };

  // Reorder handler — adds all items from a past order back to context
  const handleReorder = (order) => {
    if (!order.items?.length) return;
    navigate("/#menu");
  };

  // Pay with Stripe handler for pending orders
  const handleStripePay = async (orderId) => {
    try {
      const res = await createCheckoutSession(orderId);
      if (res?.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch (err) {
      console.error("Pay now error:", err);
      window.alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to initiate Stripe checkout. Please try again."
      );
    }
  };

  // Empty state 
  if (!userOrders || userOrders.length === 0) {
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
        {/* Welcome Header  */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <ProfilePhotoManager user={user} updateUser={updateUser} showToast={showToast} />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#351B17] font-['Poppins',sans-serif] leading-tight">
                  Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
                </h1>
                <p className="text-xs text-[#7A5C55]">Here's what's happening with your orders</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refreshOrders()}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A5C55] hover:text-[#941508] bg-white border border-[#E8D595] px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
              title="Refresh orders live"
            >
              <RefreshCw size={13} className={isSyncing ? "animate-spin text-[#941508]" : ""} />
              <span>{isSyncing ? "Syncing..." : "Live Sync"}</span>
            </button>
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

        {/* Active Order Trackers  */}
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
                onCancel={handleCancelOrder}
                onPayStripe={handleStripePay}
              />
            ))}
          </div>
        )}

        {/*  Order History  */}
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
                  onPayStripe={handleStripePay}
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
