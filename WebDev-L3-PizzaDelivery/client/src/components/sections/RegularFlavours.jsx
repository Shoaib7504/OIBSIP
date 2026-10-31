import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Sparkles, Filter } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { regularFlavours } from "../../data/pizzasData";

export const RegularFlavours = () => {
  const { addToCart, setActivePizzaModal } = useCart();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredFlavours = regularFlavours.filter((pizza) => {
    if (activeFilter === "veg") return pizza.isVeg;
    if (activeFilter === "non-veg") return !pizza.isVeg;
    return true;
  });

  return (
    <section id="regular-flavours" className="py-16 md:py-24 relative overflow-hidden bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Regular Flavours"
          subtitle="A symphony of authentic Italian spices, slow-simmered sauces, and freshly kneaded sourdough dough"
        />

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {[
            { key: "all", label: "All Flavours" },
            { key: "veg", label: "Vegetarian 🌿" },
            { key: "non-veg", label: "Non-Veg 🍗" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.key
                  ? "bg-[#941508] text-white shadow-sm"
                  : "bg-[#FFF0B8]/60 text-[#351B17] hover:bg-[#FFF0B8] border border-[#E8D595]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 8 Products 4x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredFlavours.map((pizza, index) => (
              <motion.div
                key={pizza.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-5 border border-[#941508]/10 shadow-xs hover:shadow-lg transition-all flex flex-col items-center text-center group justify-between"
              >
                {/* Circular Food Image with Plate styling */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 my-2">
                  {/* Golden outer glow */}
                  <div className="absolute inset-0 rounded-full bg-[#FFF0B8] border-2 border-[#E8D595] group-hover:scale-105 transition-transform" />
                  <motion.img
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    src={pizza.image}
                    alt={pizza.name}
                    onClick={() => setActivePizzaModal(pizza)}
                    className="w-full h-full object-cover rounded-full p-2 relative z-10 cursor-pointer"
                  />
                </div>

                {/* Info */}
                <div className="w-full mt-3">
                  <h3
                    onClick={() => setActivePizzaModal(pizza)}
                    className="font-black text-base text-[#351B17] group-hover:text-[#941508] transition-colors cursor-pointer truncate"
                  >
                    {pizza.name}
                  </h3>
                  <p className="text-xs text-[#7A5C55] mt-1.5 line-clamp-2 h-8 leading-relaxed">
                    {pizza.description}
                  </p>
                </div>

                {/* Bottom Row: Price & Order */}
                <div className="w-full mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-black text-[#941508]">
                    Price: ${pizza.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(pizza)}
                    className="px-3.5 py-1.5 rounded-full bg-[#941508] hover:bg-[#7a1106] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag size={13} />
                    Order
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View Full Menu CTA */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => {
              setActiveFilter("all");
              window.scrollTo({ top: 600, behavior: "smooth" });
            }}
            variant="outline"
            size="md"
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};
