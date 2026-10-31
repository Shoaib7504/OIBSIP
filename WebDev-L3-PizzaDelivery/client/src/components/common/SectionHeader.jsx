import React from "react";
import { motion } from "motion/react";

export const SectionHeader = ({
  title,
  subtitle,
  centered = true,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  light = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-8 md:mb-12 ${centered ? "text-center" : "text-left"} ${className}`}
    >
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
          light ? "text-white" : "text-[#351B17]"
        } ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2.5 max-w-2xl text-sm sm:text-base leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/80" : "text-[#7A5C55]"} ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
