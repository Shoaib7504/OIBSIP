import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { PIZZA_IMAGES } from "../../../data/pizzasData";
import { SteamEffect } from "./SteamEffect";

/**
 * RotatingPizza3D
 * 3D-perspective pizza centerpiece with hardware-accelerated continuous 360-degree rotation,
 * subtle 3D wobble/tilt, warm crust rim, and rising steam, harmonized with PizzaCrave's cream palette.
 */
export const RotatingPizza3D = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center [perspective:1200px]">
      {/* 1. Ambient Warm Hearth Glows behind pizza */}
      <div
        className="absolute w-[130%] h-[130%] rounded-full bg-radial from-[#FFF0B8]/80 via-[#F49A13]/20 to-transparent blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "3.5s" }}
        aria-hidden="true"
      />

      {/* 2. Concentric Golden Heat Rings (Matching Hero Centerpiece) */}
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[115%] h-[115%] rounded-full border border-dashed border-[#F49A13]/35 pointer-events-none"
        aria-hidden="true"
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="absolute w-[106%] h-[106%] rounded-full border border-[#941508]/15 pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. Cast Drop Shadow beneath the 3D tilted pizza */}
      <div
        className="absolute -bottom-6 w-3/4 h-12 bg-[#941508]/20 rounded-full blur-xl pointer-events-none transform scale-y-50"
        aria-hidden="true"
      />

      {/* 4. Rising Hot Oven Steam from the center */}
      <SteamEffect />

      {/* 5. 3D Tilted & Continuously Rotating Pizza Container */}
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] flex items-center justify-center"
        initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={
          shouldReduceMotion
            ? { scale: 1, opacity: 1 }
            : {
                scale: 1,
                opacity: 1,
                rotateX: [20, 24, 20],
                rotateY: [-3, 3, -3],
                y: [-6, 6, -6],
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.3 }
            : {
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.8 },
                rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 7, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        {/* Continuous 360-degree Rotating Pizza Disc */}
        <motion.div
          className="relative w-full h-full rounded-full p-2.5 sm:p-3 bg-gradient-to-tr from-[#941508]/20 via-white to-[#F49A13]/25 shadow-[0_25px_60px_-15px_rgba(148,21,8,0.28)]"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        >
          {/* Wood-fired crust golden rim */}
          <div className="w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-[#C97A19]/50 shadow-inner relative">
            <img
              src={PIZZA_IMAGES.heroPizza}
              alt="Artisan wood-fired pizza with vibrant mozzarella, fresh basil, and ripe tomatoes"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none filter contrast-105 saturate-110"
              loading="eager"
            />

            {/* Specular light sheen overlay for 3D depth */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
