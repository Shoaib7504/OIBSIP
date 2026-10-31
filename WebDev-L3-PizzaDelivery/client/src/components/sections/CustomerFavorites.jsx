import React from "react";
import { motion } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import { VegBadge } from "../common/Badge";
import { RatingStars } from "../common/RatingStars";
import { Button } from "../common/Button";
import { useCart } from "../../context/CartContext";
import { customerFavorites } from "../../data/pizzasData";

export const CustomerFavorites = () => {
  const { addToCart, setActivePizzaModal } = useCart();

  return (
    <section id="menu" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Customer Favorites"
          subtitle="Our most loved, high-demand pizzas hand-stretched and baked to perfection every single day"
        />

        {/* 3 Featured Cards Grid with Overlapping Pizza Disc Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 pt-16 pb-8">
          {customerFavorites.map((pizza, index) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative bg-[#FFF0B8] rounded-[28px] border border-[#E8D595] p-6 pt-24 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Overlapping Circular Pizza Image */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-36 sm:h-36">
                <div className="relative w-full h-full">
                  {/* Subtle shadow beneath plate */}
                  <div className="absolute inset-2 rounded-full bg-[#351B17]/20 blur-md translate-y-2 pointer-events-none" />
                  <motion.img
                    whileHover={{ scale: 1.08, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={pizza.image}
                    alt={pizza.name}
                    onClick={() => setActivePizzaModal(pizza)}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-md relative z-10 cursor-pointer"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-3">
                  <VegBadge isVeg={pizza.isVeg} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#941508] bg-white/70 px-2 py-0.5 rounded-full border border-[#941508]/15">
                    {pizza.badge}
                  </span>
                </div>

                {/* Pizza Name */}
                <h3
                  onClick={() => setActivePizzaModal(pizza)}
                  className="text-xl font-black text-[#351B17] hover:text-[#941508] transition-colors cursor-pointer text-center md:text-left"
                >
                  {pizza.name}
                </h3>

                {/* Star Rating */}
                <div className="mt-2 flex justify-center md:justify-start">
                  <RatingStars rating={pizza.rating} reviews={pizza.reviews} />
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm text-[#7A5C55] leading-relaxed line-clamp-3">
                  {pizza.description}
                </p>
              </div>

              {/* Card Bottom: Price and Order CTA */}
              <div className="mt-6 pt-4 border-t border-[#E8D595] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#7A5C55] block">
                    Starting at
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#941508]">
                    ${pizza.price.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={() => addToCart(pizza)}
                  variant="primary"
                  size="sm"
                  icon={ShoppingBag}
                >
                  Order Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Centered Explore button */}
        <div className="text-center mt-6">
          <a href="#regular-flavours">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Explore Full Menu
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
