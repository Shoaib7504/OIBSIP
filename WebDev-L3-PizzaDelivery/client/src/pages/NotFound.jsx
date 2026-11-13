import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  Home,
  Pizza,
  ArrowLeft,
  Compass,
  ShoppingBag,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "../components/common/Button";
import {
  BasilIcon,
  TomatoIcon,
  CheeseIcon,
  PepperoniIcon,
} from "../components/common/IngredientIcons";
import chefDecorationSvg from "../assets/images/chef-decoration.svg";

/**
 * PizzaWithMissingSlice
 * A playful artisanal vector pizza graphic representing 404:
 * A wood-fired pizza with one slice pulled out, showing hot cheese pull strings
 * and floating crumbs.
 */
const PizzaWithMissingSlice = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center select-none">
      {/* Warm Ambient Hearth Glow */}
      <div
        className="absolute inset-0 rounded-full bg-radial from-[#F49A13]/30 via-[#941508]/15 to-transparent blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Pizza Body SVG (Pizza with a missing 60-degree slice at top-right) */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_15px_25px_rgba(148,21,8,0.25)]"
        animate={shouldReduceMotion ? {} : { rotate: [0, 4, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <defs>
          {/* Crust Gradient */}
          <radialGradient id="crustGrad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#C97A19" />
            <stop offset="90%" stopColor="#A35407" />
            <stop offset="100%" stopColor="#6E3100" />
          </radialGradient>
          {/* Cheese Surface Gradient */}
          <radialGradient id="cheeseGrad" cx="45%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="60%" stopColor="#FFCA28" />
            <stop offset="100%" stopColor="#FFA000" />
          </radialGradient>
          {/* Sauce Rim Gradient */}
          <radialGradient id="sauceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="#B71C1C" />
            <stop offset="100%" stopColor="#7F0000" />
          </radialGradient>
        </defs>

        {/* 1. Wood-Fired Crust (Circle with a wedge cutout from 30deg to 90deg) */}
        {/* Full Crust Base */}
        <circle cx="100" cy="100" r="92" fill="url(#crustGrad)" />
        {/* Charred wood-fired blisters on crust */}
        <circle cx="28" cy="80" r="4" fill="#3E1A00" opacity="0.6" />
        <circle cx="45" cy="38" r="5" fill="#3E1A00" opacity="0.5" />
        <circle cx="155" cy="150" r="4.5" fill="#3E1A00" opacity="0.55" />
        <circle cx="85" cy="188" r="5" fill="#3E1A00" opacity="0.6" />
        <circle cx="40" cy="145" r="4" fill="#3E1A00" opacity="0.5" />

        {/* 2. Rich Tomato Sauce Layer */}
        <circle cx="100" cy="100" r="80" fill="url(#sauceGrad)" />

        {/* 3. Melted Mozzarella Cheese Layer */}
        <circle cx="100" cy="100" r="74" fill="url(#cheeseGrad)" />

        {/* 4. Missing Slice Cutout (The wedge that was eaten) */}
        <path
          d="M100 100 L180 60 A95 95 0 0 0 135 15 Z"
          fill="#FFFDF7"
          className="transition-colors"
        />
        {/* Subtle shadow on the cut edges inside the pizza */}
        <line
          x1="100"
          y1="100"
          x2="180"
          y2="60"
          stroke="#8D4004"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1="100"
          y1="100"
          x2="135"
          y2="15"
          stroke="#8D4004"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 5. Toppings on the remaining pizza */}
        {/* Pepperoni Slices */}
        <g fill="#991B1B" stroke="#7F1D1D" strokeWidth="1.5">
          <circle cx="65" cy="70" r="14" fill="#DC2626" />
          <circle cx="58" cy="120" r="15" fill="#DC2626" />
          <circle cx="105" cy="145" r="14" fill="#DC2626" />
          <circle cx="138" cy="110" r="13.5" fill="#DC2626" />
          <circle cx="95" cy="78" r="12" fill="#DC2626" />
        </g>
        {/* Pepperoni seasoning dots */}
        <circle cx="62" cy="68" r="1.5" fill="#7F1D1D" />
        <circle cx="68" cy="74" r="1.5" fill="#FECACA" />
        <circle cx="55" cy="117" r="1.5" fill="#7F1D1D" />
        <circle cx="63" cy="123" r="1.5" fill="#FECACA" />
        <circle cx="102" cy="142" r="1.5" fill="#7F1D1D" />
        <circle cx="109" cy="147" r="1.5" fill="#FECACA" />

        {/* Basil Leaves */}
        <path
          d="M80 105 C72 100 70 88 82 85 C92 88 90 102 80 105 Z"
          fill="#16A34A"
          stroke="#15803D"
        />
        <path
          d="M125 75 C118 70 120 60 130 62 C138 65 135 78 125 75 Z"
          fill="#16A34A"
          stroke="#15803D"
        />
        <path
          d="M85 160 C78 155 80 144 92 147 C98 152 95 163 85 160 Z"
          fill="#16A34A"
          stroke="#15803D"
        />
        <path
          d="M45 92 C38 88 40 78 50 80 C56 84 53 94 45 92 Z"
          fill="#16A34A"
          stroke="#15803D"
        />

        {/* Cheese strings stretching towards missing slice */}
        <path
          d="M103 98 Q125 80 148 65"
          stroke="#FFA000"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M98 96 Q115 65 125 45"
          stroke="#FFD54F"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>

      {/* Floating Missing Slice (Hovering slightly away with cheese pull) */}
      <motion.div
        className="absolute top-1 right-1 sm:top-2 sm:right-2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 8, 4, 0],
                y: [0, -8, -4, 0],
                rotate: [0, 6, 2, 0],
              }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_15px_rgba(148,21,8,0.35)]">
          {/* Crust Arc */}
          <path
            d="M15 85 L90 50 A85 85 0 0 0 50 10 Z"
            fill="url(#crustGrad)"
          />
          {/* Sauce Layer */}
          <path
            d="M20 80 L82 48 A75 75 0 0 0 48 16 Z"
            fill="url(#sauceGrad)"
          />
          {/* Cheese Layer */}
          <path
            d="M23 76 L77 46 A68 68 0 0 0 46 20 Z"
            fill="url(#cheeseGrad)"
          />
          {/* Mini Pepperoni on the slice */}
          <circle cx="50" cy="46" r="10" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <circle cx="48" cy="44" r="1" fill="#7F1D1D" />
          <circle cx="53" cy="48" r="1" fill="#FECACA" />
          {/* Fresh Basil leaf */}
          <path
            d="M38 62 C32 58 35 50 42 52 C48 55 45 64 38 62 Z"
            fill="#16A34A"
          />
        </svg>
      </motion.div>

      {/* Playful Floating Crumbs */}
      <motion.div
        className="absolute top-12 right-2 w-2 h-2 rounded-full bg-[#C97A19]"
        animate={shouldReduceMotion ? {} : { y: [-3, 3, -3], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-20 right-8 w-1.5 h-1.5 rounded-full bg-[#FFA000]"
        animate={shouldReduceMotion ? {} : { y: [3, -3, 3], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
        aria-hidden="true"
      />
    </div>
  );
};

/**
 * NotFound (404 Page)
 * On-brand 404 page for PizzaCrave matching the warm cream (#FFFDF7),
 * brick red (#941508), and cheese gold (#F49A13) design system.
 */
export const NotFound = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Floating ingredients in the background
  const ambientBadges = [
    { Icon: BasilIcon, size: 28, pos: "top-10 left-6 sm:left-16", delay: 0, duration: 4.5 },
    { Icon: PepperoniIcon, size: 34, pos: "top-16 right-8 sm:right-24", delay: 0.5, duration: 5.2 },
    { Icon: CheeseIcon, size: 30, pos: "bottom-12 left-8 sm:left-28", delay: 1, duration: 4.8 },
    { Icon: TomatoIcon, size: 28, pos: "bottom-16 right-6 sm:right-20", delay: 1.5, duration: 5.5 },
  ];

  return (
    <section
      className="min-h-[85vh] bg-[#FFFDF7] bg-diagonal-lines flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="not-found-heading"
    >
      {/* Decorative Warm Ambient Glows (matching Hero section) */}
      <div
        className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FFF0B8]/70 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -right-20 w-96 h-96 bg-[#941508]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Ambient Ingredient Badges */}
      {ambientBadges.map((badge, idx) => {
        const { Icon, size, pos, delay, duration } = badge;
        return (
          <motion.div
            key={idx}
            className={`absolute ${pos} pointer-events-none hidden sm:block z-10`}
            initial={shouldReduceMotion ? { opacity: 0.8 } : { opacity: 0, scale: 0.6 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.8 }
                : {
                    opacity: [0.7, 1, 0.7],
                    y: [-8, 8, -8],
                    rotate: [-8, 8, -8],
                  }
            }
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
            aria-hidden="true"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E8D595] shadow-[0_8px_20px_rgba(148,21,8,0.08)] flex items-center justify-center">
              <Icon size={size} />
            </div>
          </motion.div>
        );
      })}

      {/* Main 404 Content Container */}
      <div className="max-w-2xl w-full mx-auto text-center relative z-20">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Error Tag Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0B8] border border-[#E8D595] text-[#941508] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#941508] animate-ping" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-black tracking-widest uppercase font-['Poppins',sans-serif]">
              Error 404 • Recipe Not Found
            </span>
          </div>

          {/* Giant "4 - [Pizza with missing slice] - 4" Showcase */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 my-2 sm:my-4">
            <span
              className="text-7xl sm:text-9xl md:text-[140px] font-black font-['Poppins',sans-serif] text-[#941508] tracking-tighter drop-shadow-sm select-none"
              aria-hidden="true"
            >
              4
            </span>

            {/* Center Pizza Graphic (Representing the '0') */}
            <PizzaWithMissingSlice />

            <span
              className="text-7xl sm:text-9xl md:text-[140px] font-black font-['Poppins',sans-serif] text-[#F49A13] tracking-tighter drop-shadow-sm select-none"
              aria-hidden="true"
            >
              4
            </span>
          </div>

          {/* Heading & Playful Copy */}
          <div className="space-y-3 max-w-lg mx-auto">
            <h1
              id="not-found-heading"
              className="text-2xl sm:text-4xl font-extrabold text-[#351B17] font-['Poppins',sans-serif] leading-tight"
            >
              Mamma Mia! That Slice Got Eaten! 🍕
            </h1>
            <p className="text-sm sm:text-base text-[#7A5C55] font-['Inter',sans-serif] leading-relaxed">
              The page you are craving doesn't exist or was snatched from the oven before it finished baking.
              Don't worry, our stone-hearth is always serving hot, fresh pizzas!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/")}
              icon={Home}
              aria-label="Return to PizzaCrave Homepage"
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/#menu")}
              icon={Pizza}
              aria-label="Explore our delicious artisan pizza menu"
              className="w-full sm:w-auto border-[#E8D595] text-[#351B17] bg-[#FFF0B8]/60 hover:bg-[#FFF0B8] hover:border-[#941508]"
            >
              Explore Menu
            </Button>
          </div>

          {/* Helpful Pizzeria Quick Links Hub */}
          <div className="pt-6 sm:pt-8 border-t border-[#E8D595]/50 max-w-md mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-[#7A5C55] mb-3">
              Popular Destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/#menu"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[#E8D595] text-[#351B17] hover:bg-[#FFF0B8] hover:text-[#941508] transition-colors shadow-2xs"
              >
                <Pizza size={13} className="text-[#F49A13]" />
                Customer Favorites
              </Link>
              <Link
                to="/#customizer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[#E8D595] text-[#351B17] hover:bg-[#FFF0B8] hover:text-[#941508] transition-colors shadow-2xs"
              >
                <Sparkles size={13} className="text-[#941508]" />
                Custom Pizza Builder
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[#E8D595] text-[#351B17] hover:bg-[#FFF0B8] hover:text-[#941508] transition-colors shadow-2xs"
              >
                <ShoppingBag size={13} className="text-[#941508]" />
                My Orders
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;

