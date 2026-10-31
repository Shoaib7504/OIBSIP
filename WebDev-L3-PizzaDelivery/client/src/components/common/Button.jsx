import React from "react";
import { motion } from "motion/react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  icon: Icon,
  disabled = false,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-colors focus:outline-none cursor-pointer select-none";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2.5 shadow-md",
  };

  const variantStyles = {
    primary:
      "bg-[#941508] text-white hover:bg-[#7d1106] active:bg-[#680e05] shadow-sm hover:shadow-md",
    secondary:
      "bg-[#C92719] text-white hover:bg-[#b02215] active:bg-[#971d12] shadow-sm",
    accent:
      "bg-[#F49A13] text-white hover:bg-[#de8b10] active:bg-[#c4790c] shadow-sm",
    outline:
      "border-2 border-[#941508] text-[#941508] bg-transparent hover:bg-[#941508]/10 active:bg-[#941508]/20",
    outlineWhite:
      "border-2 border-white text-white bg-transparent hover:bg-white/15 active:bg-white/25",
    ghost:
      "text-[#351B17] hover:bg-black/5 active:bg-black/10",
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.04, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      } ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />}
      {children}
    </motion.button>
  );
};

