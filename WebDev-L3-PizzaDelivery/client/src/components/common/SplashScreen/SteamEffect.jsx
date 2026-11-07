import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * SteamEffect
 * Delicate wavy steam plumes that rise from the hot pizza surface
 * with organic fading, drift, and scale, harmonized for light cream background.
 */
export const SteamEffect = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  // 4 distinct steam plumes with staggered positions, delays, and paths
  const steamPlumes = [
    { id: 1, left: "28%", delay: 0, duration: 3.2, scale: 0.9, xDrift: [-6, 12, -4] },
    { id: 2, left: "44%", delay: 0.8, duration: 3.8, scale: 1.1, xDrift: [4, -14, 6] },
    { id: 3, left: "60%", delay: 1.6, duration: 3.4, scale: 1.0, xDrift: [-8, 8, -6] },
    { id: 4, left: "74%", delay: 2.2, duration: 4.0, scale: 0.85, xDrift: [6, -10, 4] },
  ];

  return (
    <div
      className="absolute -top-20 inset-x-0 h-40 pointer-events-none z-20 overflow-visible"
      aria-hidden="true"
    >
      {steamPlumes.map((plume) => (
        <motion.div
          key={plume.id}
          className="absolute bottom-0 w-12 h-32 origin-bottom"
          style={{ left: plume.left }}
          initial={{ opacity: 0, y: 15, scaleY: 0.4, scaleX: plume.scale }}
          animate={{
            opacity: [0, 0.5, 0.35, 0],
            y: [-10, -50, -85, -120],
            x: plume.xDrift,
            scaleY: [0.6, 1.1, 1.4, 1.7],
            scaleX: [plume.scale, plume.scale * 1.3, plume.scale * 1.6, plume.scale * 2],
          }}
          transition={{
            duration: plume.duration,
            repeat: Infinity,
            delay: plume.delay,
            ease: "easeOut",
          }}
        >
          <svg
            viewBox="0 0 50 140"
            fill="none"
            className="w-full h-full filter blur-[2px]"
          >
            <defs>
              <linearGradient id={`steam-grad-${plume.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#C97A19" stopOpacity="0.55" />
                <stop offset="40%" stopColor="#E0C79B" stopOpacity="0.4" />
                <stop offset="75%" stopColor="#FFF0B8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFFDF7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M25 140 C12 110 38 85 24 55 C12 25 32 10 25 0"
              stroke={`url(#steam-grad-${plume.id})`}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
