import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Flame, Clock } from "lucide-react";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { PIZZA_IMAGES, heroMiniCards } from "../../data/pizzasData";

export const Hero = () => {
  const { setActivePizzaModal, setIsCustomizerOpen } = useCart();

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-diagonal-lines"
    >
      {/* Decorative background blur glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FFF0B8]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#941508]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Row with Mini Cards */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          {/* Main Title & Taglines (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            {/* Quick Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0B8] border border-[#E8D595] text-[#941508] text-xs font-bold mb-4 shadow-2xs">
              <Flame size={14} className="text-[#C92719]" />
              <span>Authentic Wood-Fired Italian Pizzeria</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#351B17] tracking-tight leading-[1.12]">
              Your favorite pizzas,{" "}
              <span className="text-[#941508] relative">
                just a click
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#F49A13] h-2.5"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  fill="currentColor"
                >
                  <path d="M0,15 Q50,0 100,15 L95,20 Q50,5 5,20 Z" />
                </svg>
              </span>{" "}
              away!
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#7A5C55] font-medium leading-relaxed max-w-lg">
              Hot & Fresh Pizza, Delivered Fast. Made with hand-stretched sourdough, imported mozzarella, and oven-baked at 800°F.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#menu">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Order Now
                </Button>
              </a>
              <a href="#deals">
                <Button variant="outline" size="lg">
                  View Menu
                </Button>
              </a>
            </div>

            {/* Quick feature stats */}
            <div className="mt-8 pt-6 border-t border-black/5 flex items-center gap-6 text-xs text-[#7A5C55]">
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#941508]" />
                <span className="font-bold text-[#351B17]">30 Mins</span> Delivery
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <Flame size={16} className="text-[#F49A13]" />
                <span className="font-bold text-[#351B17]">800°F</span> Wood-Fired
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div>
                <span className="font-bold text-[#351B17]">4.9★</span> (10k+ reviews)
              </div>
            </div>
          </motion.div>

          {/* 3 Mini Cards in Top-Right Corner matching screenshot */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-row flex-wrap sm:flex-nowrap gap-3 self-start lg:self-center"
          >
            {heroMiniCards.map((mini) => (
              <motion.div
                key={mini.id}
                whileHover={{ y: -4, scale: 1.03 }}
                onClick={() =>
                  setActivePizzaModal({
                    id: mini.id,
                    name: mini.name,
                    price: parseFloat(mini.price.replace("$", "")),
                    image: mini.image,
                    description: `Crispy stone-baked ${mini.name} prepared fresh with authentic ingredients.`,
                    rating: 4.8,
                    reviews: 95,
                    isVeg: mini.name === "Margherita",
                  })
                }
                className="flex items-center gap-2.5 p-2 pr-4 bg-white/95 rounded-2xl border border-[#941508]/15 shadow-sm hover:shadow-md hover:border-[#941508]/40 transition-all cursor-pointer backdrop-blur-xs"
              >
                <img
                  src={mini.image}
                  alt={mini.name}
                  className="w-11 h-11 rounded-full object-cover shadow-inner border border-gray-100"
                />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-[#351B17] leading-tight">
                    {mini.name}
                  </h4>
                  <span className="text-[11px] font-extrabold text-[#941508]">
                    {mini.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Hero Main Pizza Centerpiece */}
        <div className="relative mt-4 flex items-center justify-center">
          {/* Subtle concentric rings */}
          <div className="absolute w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px] rounded-full border border-[#941508]/10 pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[540px] md:h-[540px] rounded-full border border-dashed border-[#F49A13]/25 pointer-events-none" />

          {/* Floating Ingredients animations around hero pizza */}
          <motion.div
            animate={{ y: [-8, 8, -8], rotate: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 left-6 sm:left-24 z-20 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold border border-emerald-200">
              🌿 <span className="sr-only">Basil</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [8, -8, 8], rotate: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute top-12 right-6 sm:right-28 z-20 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold border border-red-200">
              🍅 <span className="sr-only">Tomato</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [-6, 6, -6], rotate: [5, -5, 5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-6 left-12 sm:left-36 z-20 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold border border-yellow-200">
              🧀 <span className="sr-only">Cheese</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [6, -6, 6], rotate: [-8, 8, -8] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            className="absolute bottom-8 right-12 sm:right-36 z-20 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold border border-amber-200">
              🍄 <span className="sr-only">Mushroom</span>
            </div>
          </motion.div>

          {/* Hero Pizza Rotating Disc */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.9, type: "spring", bounce: 0.3 }}
            className="relative z-10 w-72 h-72 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px] rounded-full p-2 bg-gradient-to-tr from-[#941508]/15 via-white to-[#F49A13]/20 shadow-[0_25px_60px_-15px_rgba(148,21,8,0.35)]"
          >
            <motion.img
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              src={PIZZA_IMAGES.heroPizza}
              alt="Artisan wood-fired pizza centerpiece"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
