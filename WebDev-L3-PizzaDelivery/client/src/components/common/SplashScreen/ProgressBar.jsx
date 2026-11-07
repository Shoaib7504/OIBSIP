import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * ProgressBar
 * A sleek progress bar matching PizzaCrave's golden crust & brick-red theme,
 * with continuous gradient animation, glowing leading pip, percentage counter,
 * and the "CRAFTING YOUR CRAVINGS..." tagline.
 */
export const ProgressBar = ({ progress = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-3"
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Application loading progress"
    >
      {/* Progress Track and Fill */}
      <div className="w-full h-2.5 bg-[#FFF0B8] border border-[#E8D595] rounded-full p-0.5 overflow-hidden shadow-inner relative">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#941508] via-[#C92719] to-[#F49A13] relative"
          initial={{ width: "0%" }}
          animate={{ width: `${clampedProgress}%` }}
          transition={
            shouldReduceMotion
              ? { duration: 0.1 }
              : { duration: 0.35, ease: "easeOut" }
          }
        >
          {/* Glowing leading light pip */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[1.5px] shadow-[0_0_8px_rgba(244,154,19,0.9)] pointer-events-none"
            aria-hidden="true"
          />
        </motion.div>
      </div>

      {/* Numerical percentage counter & Tagline */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold">
        <motion.span
          className="text-[11px] sm:text-xs font-black tracking-[0.22em] uppercase text-[#7A5C55] font-['Poppins',sans-serif] flex items-center gap-1.5"
          animate={shouldReduceMotion ? {} : { opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F49A13] animate-ping" />
          CRAFTING YOUR CRAVINGS...
        </motion.span>

        <span className="tabular-nums font-mono font-black text-[#941508] text-sm">
          {clampedProgress}%
        </span>
      </div>
    </div>
  );
};
