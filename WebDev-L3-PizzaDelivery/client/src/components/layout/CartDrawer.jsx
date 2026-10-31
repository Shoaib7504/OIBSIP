import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useCart } from "../../context/CartContext";
import { Button } from "../common/Button";

export const CartDrawer = () => {
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
  } = useCart();

  const [isOrdered, setIsOrdered] = useState(false);

  const handleCheckout = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsOrdered(true);
    setTimeout(() => {
      clearCart();
    }, 400);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsOrdered(false);
  };

  const freeDeliveryThreshold = 30;
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FFFDF7] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#941508]/10 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508]">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#351B17]">
                      Your Craving Cart
                    </h3>
                    <p className="text-xs text-[#7A5C55]">
                      {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 text-[#351B17]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Delivery Bar */}
              {cartItems.length > 0 && !isOrdered && (
                <div className="px-6 py-3 bg-[#FFF0B8]/60 border-b border-[#E8D595]">
                  <div className="flex justify-between items-center text-xs font-semibold text-[#351B17] mb-1.5">
                    <span>
                      {subtotal >= freeDeliveryThreshold
                        ? "🎉 You unlocked FREE Delivery!"
                        : `Add $${(freeDeliveryThreshold - subtotal).toFixed(2)} more for FREE Delivery`}
                    </span>
                    <span>{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C92719] transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {isOrdered ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 shadow-lg">
                      <CheckCircle2 size={44} />
                    </div>
                    <h4 className="text-2xl font-black text-[#941508] mb-2">
                      Order Confirmed!
                    </h4>
                    <p className="text-sm text-[#7A5C55] leading-relaxed mb-6">
                      Our chefs are already tossing your dough! Your hot & fresh pizza will arrive at your door in approx. 28 minutes.
                    </p>
                    <Button onClick={handleClose} variant="primary">
                      Back to Menu
                    </Button>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-24 h-24 rounded-full bg-[#FFF0B8] flex items-center justify-center text-[#941508] mb-4">
                      <ShoppingBag size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-[#351B17] mb-1">
                      Your cart is empty
                    </h4>
                    <p className="text-sm text-[#7A5C55] max-w-xs mb-6">
                      Explore our delicious wood-fired pizzas and satisfy your cravings!
                    </p>
                    <Button
                      onClick={handleClose}
                      variant="primary"
                    >
                      Browse Flavours
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartKey}
                        className="flex gap-4 p-3.5 bg-white rounded-2xl border border-[#941508]/10 shadow-xs"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-18 h-18 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-sm text-[#351B17] truncate">
                              {item.name}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.cartKey)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-[#7A5C55] mt-0.5">
                            Size: <span className="font-semibold">{item.size}</span>
                          </p>
                          {item.customOptions && (
                            <p className="text-[11px] text-[#F49A13] font-medium truncate">
                              Custom: {item.customOptions.crust}, {item.customOptions.cheese}
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
                                className="w-5 h-5 flex items-center justify-center text-[#7A5C55] hover:text-[#941508]"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.cartKey, 1)}
                                className="w-5 h-5 flex items-center justify-center text-[#7A5C55] hover:text-[#941508]"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && !isOrdered && (
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
                    onClick={handleCheckout}
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    icon={ArrowRight}
                  >
                    Order Now (${total.toFixed(2)})
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
