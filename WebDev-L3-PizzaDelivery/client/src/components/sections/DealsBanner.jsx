import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Clock, ArrowRight, Tag } from "lucide-react";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { PIZZA_IMAGES } from "../../data/pizzasData";

export const DealsBanner = () => {
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const handleOrderDeal = (dealName, price) => {
    addToCart(
      {
        id: `deal-${dealName.replace(/\s+/g, "-").toLowerCase()}`,
        name: dealName,
        price: price,
        image: PIZZA_IMAGES.dealPizza,
        description: "Special combo promotional deal with free drinks and sides.",
      },
      "Large"
    );
  };

  return (
    <section id="deals" className="py-12 md:py-16 relative overflow-hidden" aria-labelledby="deals-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl md:rounded-[36px] overflow-hidden shadow-2xl bg-gradient-to-r from-[#8B0E05] via-[#B81E10] to-[#E66A0C] text-white p-6 sm:p-10 lg:p-14"
        >
          {/* Decorative background shapes */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
          <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-black/20 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header with Limited Offer tag */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[#FFF0B8] text-xs font-bold uppercase tracking-wider border border-white/25">
                  <Clock size={13} aria-hidden="true" /> Limited Time Only
                </span>
                <span className="text-xs text-white/90 font-medium">
                  Valid until Sunday midnight
                </span>
              </div>

              <div>
                <h2
                  id="deals-heading"
                  className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight"
                >
                  Today's Best Deals
                </h2>
                <p className="text-sm sm:text-base text-white/95 mt-2 max-w-lg leading-relaxed">
                  Treat yourself and your friends with our chef-curated combos at unbeatable limited-time prices!
                </p>
              </div>

              {/* Offer 1 Card */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                className="bg-black/20 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFF0B8]">
                    Offer 1
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    Classic Margherita – Buy One Get One Free!
                  </h3>
                  <p className="text-xs text-white/90 mt-1">
                    Order any medium Margherita and get a second one completely free.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOrderDeal("BOGO Margherita Combo", 12.99)}
                  className="px-4 py-2.5 rounded-full bg-white text-[#941508] hover:bg-[#FFF0B8] text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-sm self-start sm:self-center cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Claim Buy One Get One Free Margherita Combo"
                >
                  Claim Offer
                </button>
              </motion.div>

              {/* Offer 2 (Highlight with $14.99) */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFF0B8]">
                  <Tag size={14} aria-hidden="true" />
                  <span>Offer 2 : Large Pepperoni Pizza + 2 Ice-Cold Drinks</span>
                </div>
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#FFF0B8] tracking-tight drop-shadow-sm">
                    $14.99
                  </span>
                  <span className="text-sm text-white/70 line-through font-semibold">
                    $24.99
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#941508] text-white text-xs font-bold">
                    Save 40%
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-4 flex-wrap">
                  <Button
                    onClick={() =>
                      handleOrderDeal("Large Pepperoni + 2 Drinks Combo", 14.99)
                    }
                    variant="accent"
                    size="lg"
                    icon={ArrowRight}
                    aria-label="Order Large Pepperoni and 2 Drinks Combo for $14.99"
                  >
                    Order Now
                  </Button>
                  <span className="text-xs text-white/90">
                    *Includes 2 craft sodas of your choice
                  </span>
                </div>
              </div>
            </div>

            {/* Right Pizza Photography with slice */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <motion.div
                initial={{ scale: 0.8, rotate: 10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
              >
                {/* Glowing drop-shadow */}
                <div className="absolute inset-4 rounded-full bg-black/40 blur-2xl" aria-hidden="true" />
                <img
                  src={PIZZA_IMAGES.dealPizza}
                  alt="Today's best deal large pepperoni pizza with golden crust"
                  className="w-full h-full object-cover rounded-full border-4 border-white/40 shadow-2xl relative z-10"
                />

                {/* Floating promo badge on pizza */}
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-3 z-20 bg-[#F49A13] text-[#351B17] font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-white flex items-center gap-1.5"
                >
                  <Sparkles size={16} aria-hidden="true" /> HOT COMBO
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
