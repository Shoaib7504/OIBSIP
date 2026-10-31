import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, ChefHat } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { PIZZA_IMAGES } from "../../data/pizzasData";
import ingredientPattern from "../../assets/patterns/ingredient-pattern.svg";

export const PizzaCustomizerSection = () => {
  const { setIsCustomizerOpen } = useCart();

  return (
    <section
      id="customize"
      className="py-16 md:py-24 relative overflow-hidden bg-[#FFFDF7]"
      style={{
        backgroundImage: `url(${ingredientPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "360px",
      }}
    >
      {/* Semi-transparent parchment layer over pattern */}
      <div className="absolute inset-0 bg-[#FFFDF7]/85 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Build Your Dream Pizza"
          subtitle="Choose your favorite hand-tossed crust, signature sauces, gourmet cheeses, and premium toppings to craft a pizza uniquely yours."
        />

        {/* Central Pizza Showcase with Floating Ingredients */}
        <div className="relative mt-8 sm:mt-12 flex flex-col items-center justify-center">
          {/* Floating Ingredients animations around the central base */}
          <motion.div
            animate={{
              y: [-12, 12, -12],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 sm:top-4 left-1/4 -translate-x-12 z-20"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-[#F49A13]/30 flex items-center justify-center text-xl">
              🧀
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [0, -20, 0],
            }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-2 sm:top-6 right-1/4 translate-x-12 z-20"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-red-300 flex items-center justify-center text-xl">
              🍅
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [-10, 10, -10],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute bottom-16 left-1/5 z-20 hidden sm:block"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-emerald-300 flex items-center justify-center text-xl">
              🌿
            </div>
          </motion.div>

          <motion.div
            animate={{
              y: [8, -8, 8],
              rotate: [15, -15, 15],
            }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-16 right-1/5 z-20 hidden sm:block"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-amber-300 flex items-center justify-center text-xl">
              🍄
            </div>
          </motion.div>

          {/* Central Pizza Base Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-3 bg-gradient-to-tr from-[#FFF0B8] via-white to-[#F49A13]/30 shadow-2xl"
          >
            <img
              src={PIZZA_IMAGES.customizerBase}
              alt="Interactive custom pizza base"
              className="w-full h-full object-cover rounded-full shadow-inner select-none pointer-events-none"
            />

            {/* Pulsing ring indicator */}
            <div className="absolute inset-0 rounded-full border-4 border-[#941508]/20 animate-ping pointer-events-none" />
          </motion.div>

          {/* Start Customizing CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="mt-8 z-20"
          >
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#941508] text-white text-base font-extrabold shadow-xl hover:bg-[#7a1106] transition-all cursor-pointer group border-2 border-[#FFF0B8]"
            >
              <ChefHat size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Start Customizing</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

