import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Pizza } from "lucide-react";
import { RotatingPizza3D } from "./RotatingPizza3D";
import { FloatingIngredients } from "./FloatingIngredients";
import { ProgressBar } from "./ProgressBar";
import { useAuth } from "../../../context/AuthContext";
import { PIZZA_IMAGES } from "../../../data/pizzasData";

/**
 * SplashScreen
 * High-performance full-screen animated entrance for PizzaCrave.
 * Perfectly styled with PizzaCrave's signature warm cream (#FFFDF7),
 * deep brick red (#941508), gold (#F49A13), and card styling (#FFF0B8/#E8D595).
 */
export const SplashScreen = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const { loading: authLoading } = useAuth();
  const [progress, setProgress] = useState(15);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const startTime = performance.now();
    const minDisplayDuration = shouldReduceMotion ? 300 : 1400;

    // 1. Preload hero pizza image and wait for document fonts
    const preloadPromise = Promise.all([
      new Promise((resolve) => {
        const img = new Image();
        img.src = PIZZA_IMAGES.heroPizza;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(true);
      }),
      document.fonts ? document.fonts.ready : Promise.resolve(),
    ]);

    // 2. Smooth progress ticker loop
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 12;
        if (prev < 75) return prev + 8;
        if (prev < 90) return prev + 3;
        return prev;
      });
    }, 120);

    // 3. Resolve readiness when real startup tasks finish
    preloadPromise.finally(() => {
      const checkReadiness = () => {
        const elapsed = performance.now() - startTime;
        const remainingTime = Math.max(0, minDisplayDuration - elapsed);

        setTimeout(() => {
          if (!isMounted) return;
          clearInterval(interval);
          setProgress(100);

          setTimeout(() => {
            if (!isMounted) return;
            setIsReady(true);
            setTimeout(() => {
              if (isMounted && onComplete) {
                onComplete();
              }
            }, 650);
          }, 200);
        }, remainingTime);
      };

      if (!authLoading) {
        checkReadiness();
      } else {
        const maxWaitTimer = setTimeout(checkReadiness, 2000);
        return () => clearTimeout(maxWaitTimer);
      }
    });

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [authLoading, shouldReduceMotion, onComplete]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key="pizzacrave-splash"
          role="status"
          aria-live="polite"
          aria-label="Loading PizzaCrave, crafting your cravings..."
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#FFFDF7] bg-diagonal-lines text-[#351B17] overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 1.05,
                  filter: "blur(6px)",
                }
          }
          transition={{
            duration: shouldReduceMotion ? 0.3 : 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Decorative Warm Ambient Glows (Matching Hero Section) */}
          <div
            className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FFF0B8]/80 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/3 -right-20 w-96 h-96 bg-[#941508]/8 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 left-1/3 w-96 h-96 bg-[#F49A13]/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Top: Animated PizzaCrave Brand Entrance (Matches Navbar Identity) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -25, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.35,
            }}
            className="relative z-40 flex flex-col items-center text-center mt-2 sm:mt-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#941508] border border-[#F49A13]/40 flex items-center justify-center text-white shadow-[0_10px_25px_rgba(148,21,8,0.25)]">
                <Pizza size={28} className="rotate-12 text-white" aria-hidden="true" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#941508] leading-tight font-['Poppins',sans-serif]">
                  Pizza<span className="text-[#F49A13]">Crave</span>
                </span>
                <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#7A5C55] -mt-1 font-['Inter',sans-serif]">
                  Artisan Wood-Fired Pizzeria
                </span>
              </div>
            </div>
          </motion.div>

          {/* Centerpiece: 3D Continuously Rotating Pizza & Orbiting Floating Ingredients */}
          <div className="relative z-30 my-auto flex items-center justify-center">
            {/* Floating Orbiting Ingredients around pizza */}
            <FloatingIngredients />

            {/* 3D Rotating Pizza Centerpiece with Steam */}
            <RotatingPizza3D />
          </div>

          {/* Bottom: Continuously Animated Progress Bar & Status Text */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-40 w-full flex flex-col items-center mb-4 sm:mb-6"
          >
            <ProgressBar progress={progress} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
