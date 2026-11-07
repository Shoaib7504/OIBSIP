import React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  BasilIcon,
  TomatoIcon,
  CheeseIcon,
  ChiliIcon,
  PepperoniIcon,
} from "../IngredientIcons";

/**
 * FloatingIngredients
 * Independent orbiting & floating ingredient elements placed around
 * the 3D rotating pizza, styled with PizzaCrave's artisan badge aesthetic.
 */
export const FloatingIngredients = () => {
  const shouldReduceMotion = useReducedMotion();

  // Floating ingredients positioned in a 360-degree organic aura around the pizza
  const ingredients = [
    // Top-Left: Basil leaf floating high
    {
      id: "basil-1",
      Icon: BasilIcon,
      size: 28,
      className: "top-[-10px] left-[12%] sm:left-[16%]",
      borderColor: "border-emerald-200",
      depth: 25,
      yRange: [-12, 12, -12],
      xRange: [-6, 8, -6],
      rotateRange: [-15, 10, -15],
      duration: 5.2,
      delay: 0,
    },
    // Top-Right: Savory Pepperoni slice
    {
      id: "pepperoni-1",
      Icon: PepperoniIcon,
      size: 36,
      className: "top-[15px] right-[10%] sm:right-[15%]",
      borderColor: "border-red-200",
      depth: 30,
      yRange: [10, -14, 10],
      xRange: [8, -8, 8],
      rotateRange: [8, -18, 8],
      duration: 6.0,
      delay: 0.4,
    },
    // Bottom-Left: Golden Cheese slice
    {
      id: "cheese-1",
      Icon: CheeseIcon,
      size: 32,
      className: "bottom-[20px] left-[8%] sm:left-[14%]",
      borderColor: "border-amber-200",
      depth: 20,
      yRange: [-14, 10, -14],
      xRange: [-8, 6, -8],
      rotateRange: [20, -10, 20],
      duration: 5.6,
      delay: 0.8,
    },
    // Bottom-Right: Fresh Basil leaf
    {
      id: "basil-2",
      Icon: BasilIcon,
      size: 26,
      className: "bottom-[5px] right-[14%] sm:right-[18%]",
      borderColor: "border-emerald-200",
      depth: 22,
      yRange: [12, -10, 12],
      xRange: [6, -6, 6],
      rotateRange: [-10, 25, -10],
      duration: 4.8,
      delay: 1.2,
    },
    // Far-Right center: Sliced juicy tomato
    {
      id: "tomato-1",
      Icon: TomatoIcon,
      size: 30,
      className: "top-[45%] -right-3 sm:-right-6",
      borderColor: "border-red-200",
      depth: 18,
      yRange: [-10, 12, -10],
      xRange: [-4, 6, -4],
      rotateRange: [-15, 12, -15],
      duration: 5.0,
      delay: 1.6,
    },
    // Far-Left center: Crispy pepperoni slice
    {
      id: "pepperoni-2",
      Icon: PepperoniIcon,
      size: 32,
      className: "top-[40%] -left-3 sm:-left-5",
      borderColor: "border-red-200",
      depth: 26,
      yRange: [8, -12, 8],
      xRange: [6, -4, 6],
      rotateRange: [15, -15, 15],
      duration: 5.4,
      delay: 0.6,
    },
    // Top center-left: Fiery chili flake
    {
      id: "chili-1",
      Icon: ChiliIcon,
      size: 22,
      className: "-top-8 left-[38%]",
      borderColor: "border-red-200",
      depth: 15,
      yRange: [-8, 8, -8],
      xRange: [-6, 6, -6],
      rotateRange: [-25, 20, -25],
      duration: 4.2,
      delay: 1.0,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-30" aria-hidden="true">
      {ingredients.map((item) => {
        const { Icon, size, className, borderColor, yRange, xRange, rotateRange, duration, delay } = item;

        return (
          <motion.div
            key={item.id}
            className={`absolute ${className}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: yRange,
                    x: xRange,
                    rotate: rotateRange,
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.3 }
                : {
                    opacity: { duration: 0.6, delay },
                    scale: { duration: 0.6, delay },
                    y: { duration, repeat: Infinity, ease: "easeInOut", delay },
                    x: { duration: duration * 1.1, repeat: Infinity, ease: "easeInOut", delay },
                    rotate: { duration: duration * 1.2, repeat: Infinity, ease: "easeInOut", delay },
                  }
            }
          >
            {/* PizzaCrave warm card badge */}
            <div className={`p-2 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border ${borderColor} shadow-[0_8px_20px_rgba(148,21,8,0.12)] flex items-center justify-center transition-transform hover:scale-110`}>
              <Icon size={size} className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
