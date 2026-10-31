import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { VegBadge } from "../common/Badge";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { customerFavorites } from "../../data/pizzasData";
import { usePizzas } from "../../hooks/usePizzas";
import { normalizePizzas } from "../../utils/pizzaUtils";
import ingredientPattern from "../../assets/images/ingredient-pattern.svg";
import vegitableSvg from "../../assets/images/vegitable.svg";

export const CustomerFavorites = () => {
  const { addToCart, setActivePizzaModal } = useCart();
  const shouldReduceMotion = useReducedMotion();
  const { data } = usePizzas();

  const backendPizzas = data?.data || [];

  const displayFavorites = useMemo(() => {
    if (backendPizzas.length >= 3) {
      // Find matching favorites or take top 3 highest rated
      const normalized = normalizePizzas(backendPizzas);
      const matches = normalized.filter((p) =>
        /margherita|pepperoni|bbq/i.test(p.name)
      );
      if (matches.length >= 3) return matches.slice(0, 3);
      return normalized.slice(0, 3);
    }
    return normalizePizzas(customerFavorites);
  }, [backendPizzas]);

  return (
    <section
      id="menu"
      className="py-16 md:py-24 relative overflow-hidden bg-[#FFFDF7]"
      style={{
        backgroundImage: `url(${ingredientPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "420px",
      }}
      aria-labelledby="favorites-heading"
    >
      {/* Semi-transparent overlay to ensure text contrast and warm paper feel */}
      <div className="absolute inset-0 bg-[#FFFDF7]/90 pointer-events-none" aria-hidden="true" />

      {/* Floating decorative rounded vegetable badge on desktop */}
      <motion.aside
        animate={shouldReduceMotion ? {} : { y: [-6, 6, -6], rotate: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="hidden xl:flex items-center gap-3 absolute top-16 right-10 z-10 bg-white/95 backdrop-blur-xs p-2 pr-4 rounded-full border border-emerald-300/80 shadow-md"
        aria-label="Farm-fresh ingredients guarantee"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/40 bg-emerald-50 shrink-0">
          <img
            src={vegitableSvg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
            100% Farm-Fresh
          </span>
          <span className="text-xs font-bold text-[#351B17]">
            Hand-Picked Daily
          </span>
        </div>
      </motion.aside>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          {/* Subtle rounded pill highlighting fresh vegetables */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-4 shadow-2xs">
            <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-emerald-500/50">
              <img
                src={vegitableSvg}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
            <span>Crafted with Crisp Farm-Fresh Vegetables &amp; Mozzarella</span>
          </div>

          <SectionHeader
            title="Customer Favorites"
            subtitle="Our most loved, high-demand pizzas hand-stretched and baked to perfection every single day"
            titleClassName="text-[#351B17]"
          />
        </div>

        {/* 3 Featured Cards Grid with Overlapping Pizza Disc Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 lg:gap-8 pt-16 pb-8">
          {displayFavorites.map((pizza, index) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={shouldReduceMotion ? {} : { y: -8 }}
              className="relative bg-[#FFF0B8] rounded-[28px] border border-[#E8D595] p-6 pt-24 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Overlapping Circular Pizza Image */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-36 sm:h-36">
                <div className="relative w-full h-full">
                  {/* Shadow beneath plate */}
                  <div
                    className="absolute inset-2 rounded-full bg-[#351B17]/25 blur-md translate-y-2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <motion.img
                    whileHover={shouldReduceMotion ? {} : { scale: 1.08, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={pizza.image}
                    alt={`Top-down view of ${pizza.name}`}
                    onClick={() => setActivePizzaModal(pizza)}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-md relative z-10 cursor-pointer"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-3">
                  <VegBadge isVeg={pizza.isVeg} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#941508] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#941508]/15">
                    {pizza.badge || (pizza.isVeg ? "100% Veg" : "Bestseller")}
                  </span>
                </div>

                {/* Pizza Name */}
                <h3
                  onClick={() => setActivePizzaModal(pizza)}
                  className="text-xl font-black text-[#351B17] hover:text-[#941508] transition-colors cursor-pointer text-center md:text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#941508] rounded-lg p-0.5"
                >
                  {pizza.name}
                </h3>

                {/* Star Rating */}
                <div className="mt-2 flex justify-center md:justify-start">
                  <RatingStars rating={pizza.rating} reviews={pizza.reviews} />
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-[#4A261F] font-medium leading-relaxed line-clamp-3">
                  {pizza.description}
                </p>

                {/* Size Pills */}
                <div
                  className="mt-4 flex items-center gap-1.5 justify-center md:justify-start"
                  aria-label="Available sizes"
                >
                  {["Small", "Medium", "Large"].map((sz) => (
                    <span
                      key={sz}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/70 text-[#4A261F] border border-[#E8D595]"
                    >
                      {sz[0]}
                    </span>
                  ))}
                  <span className="text-[10px] text-[#4A261F]/80 ml-1 font-semibold">Available</span>
                </div>
              </div>

              {/* Card Bottom: Price and Order CTA */}
              <div className="mt-6 pt-4 border-t border-[#E8D595] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#4A261F] block">
                    Starting at
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#941508]">
                    ${Number(pizza.price).toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => addToCart(pizza)}
                  variant="primary"
                  size="sm"
                  icon={ShoppingBag}
                  aria-label={`Order ${pizza.name} for $${Number(pizza.price).toFixed(2)}`}
                >
                  Order Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Centered Explore button */}
        <div className="text-center mt-6">
          <a href="#regular-flavours" tabIndex={-1}>
            <Button variant="primary" size="md" icon={ArrowRight}>
              Explore Full Menu
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
