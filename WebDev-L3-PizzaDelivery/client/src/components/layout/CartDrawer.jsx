import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "../../context/CartContext";
import { useOrderInventory } from "../../context/OrderInventoryContext";
import { useAuth } from "../../context/AuthContext";
import { CheckoutForm } from "../sections/CheckoutForm";
import { Button } from "../common/Button";
import { useQueryClient } from "@tanstack/react-query";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total,
    totalItemsCount,
    showToast,
  } = useCart();

  const { placeBackendOrder } = useOrderInventory();

  // Steps: "cart" | "checkout" | "success"
  const [drawerStep, setDrawerStep] = useState("cart");
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen]);

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset to cart step after animation finishes
    setTimeout(() => {
      setDrawerStep("cart");
      setCreatedOrder(null);
      setIsSubmitting(false);
    }, 300);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setDrawerStep("checkout");
  };

  const handleCheckoutSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Construct payload according to backend Mongoose Order schema
      const orderPayload = {
        user: user?._id || user?.id || null,
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          address: {
            street: formData.street.trim(),
            city: formData.city.trim(),
            postalCode: formData.postalCode.trim(),
          },
        },
        items: cartItems.map((item) => {
          // Identify pizza MongoDB ObjectId if valid 24-char hex, else omit
          const rawId = item._id || item.pizza?._id || item.id;
          const pizzaId =
            typeof rawId === "string" && /^[0-9a-fA-F]{24}$/.test(rawId)
              ? rawId
              : undefined;

          return {
            pizza: pizzaId,
            name: item.name,
            size: (item.size || "medium").toLowerCase(),
            quantity: item.quantity,
            price: Number(item.price),
          };
        }),
        totalAmount: Number(total.toFixed(2)),
        paymentMethod: formData.paymentMethod || "COD",
        paymentStatus: formData.paymentMethod === "COD" ? "Pending" : "Completed",
      };

      // Send to Backend API and sync context
      const newOrder = await placeBackendOrder(orderPayload);
      setCreatedOrder(newOrder);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Clear the shopping cart
      clearCart();

      // Refetch pizzas to reflect decreased stock in UI
      queryClient.invalidateQueries({ queryKey: ["pizzas"] });

      // Advance to success view
      setDrawerStep("success");
      showToast("Order placed successfully! Preparing your pizza.", "success");
    } catch (error) {
      console.error("[PizzaCrave] Checkout failed:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Could not place your order. Please check if the server is running.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const freeDeliveryThreshold = 30;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-screen max-w-lg bg-[#FFFDF7] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[#941508]/10 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  {drawerStep === "checkout" ? (
                    <button
                      type="button"
                      onClick={() => setDrawerStep("cart")}
                      className="w-9 h-9 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508] hover:bg-[#941508] hover:text-white transition-colors cursor-pointer"
                      title="Back to Cart Items"
                    >
                      <ArrowLeft size={18} />
                    </button>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508]"
                      aria-hidden="true"
                    >
                      <ShoppingBag size={20} />
                    </div>
                  )}

                  <div>
                    <h2
                      id="cart-drawer-title"
                      className="font-extrabold text-base sm:text-lg text-[#351B17]"
                    >
                      {drawerStep === "checkout"
                        ? "Delivery & Checkout"
                        : drawerStep === "success"
                        ? "Order Confirmed!"
                        : "Your Craving Cart"}
                    </h2>
                    <p className="text-xs text-[#7A5C55]">
                      {drawerStep === "checkout"
                        ? "Confirm your address & payment"
                        : `${totalItemsCount} ${
                            totalItemsCount === 1 ? "item" : "items"
                          }`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 text-[#351B17] min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] cursor-pointer"
                  aria-label="Close cart"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Free Delivery Bar (only on cart step) */}
              {drawerStep === "cart" && cartItems.length > 0 && (
                <div
                  className="px-6 py-2.5 bg-[#FFF0B8]/60 border-b border-[#E8D595]"
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div className="flex justify-between items-center text-xs font-semibold text-[#351B17] mb-1">
                    <span>
                      {subtotal >= freeDeliveryThreshold
                        ? "🎉 You unlocked FREE Delivery!"
                        : `Add $${(freeDeliveryThreshold - subtotal).toFixed(
                            2
                          )} more for FREE Delivery`}
                    </span>
                    <span>{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C92719] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                {/* ── STEP 1: SUCCESS SCREEN ── */}
                {drawerStep === "success" ? (
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6"
                  >
                    <div
                      className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg animate-bounce"
                      aria-hidden="true"
                    >
                      <CheckCircle2 size={44} />
                    </div>

                    <h3 className="text-2xl font-black text-[#941508] mb-1">
                      Order Confirmed!
                    </h3>
                    <p className="text-xs text-[#7A5C55] mb-4">
                      Thank you for choosing PizzaCrave! Your order has been placed.
                    </p>

                    {/* Order Details Badge Card */}
                    {createdOrder && (
                      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E8D595] p-4 text-left shadow-2xs mb-6 space-y-2.5 text-xs text-[#351B17]">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="font-bold text-[#7A5C55]">Order ID:</span>
                          <span className="font-black text-[#941508] bg-[#FFF0B8] px-2.5 py-0.5 rounded-full text-[11px]">
                            {createdOrder.id || createdOrder._id}
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-[#941508] shrink-0 mt-0.5" />
                          <span className="text-gray-600 truncate">
                            {createdOrder.deliveryAddress}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CreditCard size={14} className="text-emerald-600" />
                            <span className="font-semibold text-gray-600">
                              Payment: {createdOrder.paymentMethod}
                            </span>
                          </div>
                          <span className="font-black text-sm text-[#941508]">
                            ${Number(createdOrder.total || total).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-[#7A5C55]">
                          <Clock size={14} className="text-[#F49A13]" />
                          <span>Estimated delivery: <strong>25–30 mins</strong></span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 w-full max-w-xs">
                      <Button
                        onClick={() => {
                          handleClose();
                          navigate("/dashboard");
                        }}
                        variant="primary"
                        size="md"
                      >
                        Track My Order Live
                      </Button>
                      <Button onClick={handleClose} variant="outline" size="md">
                        Back to Menu
                      </Button>
                    </div>
                  </motion.div>
                ) : drawerStep === "checkout" ? (
                  /* ── STEP 2: CHECKOUT FORM ── */
                  <div className="space-y-4">
                    {/* Order Price Glance */}
                    <div className="p-3 bg-[#FFF0B8]/60 border border-[#E8D595] rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-[#351B17]">
                        Total to Pay ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}):
                      </span>
                      <span className="font-black text-base text-[#941508]">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    <CheckoutForm
                      onSubmit={handleCheckoutSubmit}
                      onCancel={() => setDrawerStep("cart")}
                      totalAmount={total}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                ) : cartItems.length === 0 ? (
                  /* ── EMPTY CART ── */
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div
                      className="w-24 h-24 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508] mb-4"
                      aria-hidden="true"
                    >
                      <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-[#351B17] mb-1">
                      Your cart is empty
                    </h3>
                    <p className="text-sm text-[#7A5C55] max-w-xs mb-6">
                      Explore our delicious wood-fired pizzas and satisfy your cravings!
                    </p>
                    <Button onClick={handleClose} variant="primary">
                      Browse Flavours
                    </Button>
                  </div>
                ) : (
                  /* ── STEP 3: CART ITEMS LIST ── */
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartKey}
                        className="flex gap-4 p-3.5 bg-white rounded-2xl border border-[#941508]/10 shadow-2xs"
                      >
                        <img
                          src={item.image}
                          alt=""
                          aria-hidden="true"
                          className="w-18 h-18 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm text-[#351B17] truncate">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.cartKey)}
                              className="text-gray-400 hover:text-red-600 p-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#941508] rounded cursor-pointer"
                              aria-label={`Remove ${item.name} from cart`}
                              title="Remove item"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>
                          <p className="text-xs text-[#7A5C55] mt-0.5">
                            Size:{" "}
                            <span className="font-semibold text-[#351B17]">
                              {item.size}
                            </span>
                          </p>
                          {item.customOptions && (
                            <p className="text-[11px] text-[#F49A13] font-medium truncate">
                              Custom: {item.customOptions.crust},{" "}
                              {item.customOptions.cheese}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-extrabold text-sm text-[#941508]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-0.5 bg-[#FFFDF7]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.cartKey, -1)}
                                className="w-7 h-7 flex items-center justify-center text-[#7A5C55] hover:text-[#941508] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#941508] rounded-full cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} aria-hidden="true" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.cartKey, 1)}
                                className="w-7 h-7 flex items-center justify-center text-[#7A5C55] hover:text-[#941508] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#941508] rounded-full cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Summary (Cart Step Only) */}
              {drawerStep === "cart" && cartItems.length > 0 && (
                <div className="p-6 border-t border-[#941508]/10 bg-white space-y-3">
                  <div className="space-y-1.5 text-xs text-[#7A5C55]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#351B17]">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-[#351B17]">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `$${deliveryFee.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-semibold text-[#351B17]">
                        ${tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-[#351B17] pt-2 border-t border-gray-100">
                      <span>Total Amount</span>
                      <span className="text-[#941508]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToCheckout}
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    icon={ArrowRight}
                  >
                    Proceed to Checkout (${total.toFixed(2)})
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
