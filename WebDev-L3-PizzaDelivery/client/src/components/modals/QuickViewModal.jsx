import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, ShoppingBag, Plus, Minus, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../common/Button";
import { VegBadge } from "../common/Badge";
import { RatingStars } from "../common/RatingStars";

export const QuickViewModal = () => {
  const { activePizzaModal, setActivePizzaModal, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [extraCheese, setExtraCheese] = useState(false);

  useEffect(() => {
    if (activePizzaModal) {
      setSelectedSize("Medium");
      setQuantity(1);
      setExtraCheese(false);
    }
  }, [activePizzaModal]);

  if (!activePizzaModal) return null;

  const pizza = activePizzaModal;

  // Calculate current price based on size
  let basePrice = pizza.price;
  if (selectedSize === "Small") {
    basePrice = pizza.sizes?.small || Math.max(5.99, Number((pizza.price * 0.8).toFixed(2)));
  } else if (selectedSize === "Large") {
    basePrice = pizza.sizes?.large || Number((pizza.price * 1.35).toFixed(2));
  } else {
    basePrice = pizza.sizes?.medium || pizza.price;
  }

  const cheeseAddon = extraCheese ? 1.5 : 0;
  const unitPrice = basePrice + cheeseAddon;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(pizza, selectedSize, extraCheese ? { extraCheese: true, extraPrice: 1.5 } : null);
    }
    setActivePizzaModal(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActivePizzaModal(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#941508]/15 text-left overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-2"
          >
            {/* Image Column */}
            <div className="relative bg-[#FFF0B8]/40 p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-doodle-pattern opacity-40 pointer-events-none" />
              <motion.img
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                src={pizza.image}
                alt={pizza.name}
                className="w-56 h-56 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-white relative z-10"
              />
              <div className="absolute top-4 left-4 z-20">
                <VegBadge isVeg={pizza.isVeg} />
              </div>
            </div>

            {/* Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-[#351B17]">
                    {pizza.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActivePizzaModal(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#7A5C55]"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-2">
                  <RatingStars rating={pizza.rating || 4.8} reviews={pizza.reviews || 95} />
                </div>

                <p className="text-xs text-[#7A5C55] mt-3 leading-relaxed">
                  {pizza.description}
                </p>

                {/* Size Selection */}
                <div className="mt-5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#351B17] block mb-2">
                    Select Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Small", "Medium", "Large"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedSize === size
                            ? "bg-[#941508] text-white border-[#941508] shadow-sm"
                            : "bg-white text-[#351B17] border-black/10 hover:border-[#941508]/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extra Topping Checkbox */}
                <div className="mt-4">
                  <label
                    onClick={() => setExtraCheese(!extraCheese)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-black/10 hover:border-[#941508]/30 cursor-pointer select-none"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        extraCheese ? "bg-[#941508] text-white" : "border border-gray-300 bg-gray-50"
                      }`}
                    >
                      {extraCheese && <Check size={14} />}
                    </div>
                    <span className="text-xs font-medium text-[#351B17] flex-1">
                      Double Gooey Mozzarella
                    </span>
                    <span className="text-xs font-bold text-[#941508]">+$1.50</span>
                  </label>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 mt-6 border-t border-[#941508]/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 border border-black/10 rounded-full px-2.5 py-1 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-[#7A5C55] hover:text-[#941508]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#7A5C55] hover:text-[#941508]"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  className="flex-1"
                  icon={ShoppingBag}
                >
                  Add (${totalPrice.toFixed(2)})
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

