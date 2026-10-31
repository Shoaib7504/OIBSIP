import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ShoppingBag, Sparkles, Leaf, Flame } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { regularFlavours } from "../../data/pizzasData";

export const RegularFlavours = () => {
  const { addToCart, setActivePizzaModal } = useCart();
  const [activeFilter, setActiveFilter] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  const filteredFlavours = regularFlavours.filter((pizza) => {
    if (activeFilter === "veg") return pizza.isVeg;
    if (activeFilter === "non-veg") return !pizza.isVeg;
    return true;
  });

  const filterTabs = [
    { key: "all", label: "All Flavours", icon: Sparkles },
    { key: "veg", label: "Vegetarian", icon: Leaf },
    { key: "non-veg", label: "Non-Veg", icon: Flame },
  ];

  return (
    <section id="regular-flavours" className="py-16 md:py-24 relative overflow-hidden bg-[#FFFDF7]" aria-labelledby="regular-flavours-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Our Regular Flavours"
          subtitle="A symphony of authentic Italian spices, slow-simmered sauces, and freshly kneaded sourdough dough"
        />

        {/* Filter Pills with ARIA tablist */}
        <div
          className="flex items-center justify-center gap-2 mb-12 flex-wrap"
          role="tablist"
          aria-label="Filter pizza menu by category"
        >
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFilter(tab.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] ${
                  isSelected
                    ? "bg-[#941508] text-white shadow-xs"
                    : "bg-[#FFF0B8]/60 text-[#351B17] hover:bg-[#FFF0B8] border border-[#E8D595]"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-white" : "text-[#941508]"} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            );
          })}
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
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={shouldReduceMotion ? {} : { y: -6 }}
                className="bg-white rounded-3xl p-5 border border-[#941508]/10 shadow-2xs hover:shadow-lg transition-all flex flex-col items-center text-center group justify-between"
              >
                {/* Circular Food Image with Plate styling */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 my-2 aspect-square">
                  {/* Golden outer glow */}
                  <div className="absolute inset-0 rounded-full bg-[#FFF0B8] border-2 border-[#E8D595] group-hover:scale-105 transition-transform" aria-hidden="true" />
                  <motion.img
                    whileHover={shouldReduceMotion ? {} : { rotate: 15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    src={pizza.image}
                    alt={`Freshly baked ${pizza.name}`}
                    onClick={() => setActivePizzaModal(pizza)}
                    className="w-full h-full object-cover rounded-full p-2 relative z-10 cursor-pointer"
                  />
                </div>

                {/* Info */}
                <div className="w-full mt-3">
                  <h3
                    onClick={() => setActivePizzaModal(pizza)}
                    className="font-black text-base text-[#351B17] group-hover:text-[#941508] transition-colors cursor-pointer truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-md"
                  >
                    {pizza.name}
                  </h3>
                  <p className="text-xs text-[#7A5C55] mt-1.5 min-h-[36px] line-clamp-2 leading-relaxed">
                    {pizza.description}
                  </p>
                </div>

                {/* Bottom Row: Price & Order */}
                <div className="w-full mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-black text-[#941508]">
                    ${pizza.price.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(pizza)}
                    className="px-4 py-2 rounded-full bg-[#941508] hover:bg-[#7a1106] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508]"
                    aria-label={`Order ${pizza.name} for $${pizza.price.toFixed(2)}`}
                  >
                    <ShoppingBag size={14} aria-hidden="true" />
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
