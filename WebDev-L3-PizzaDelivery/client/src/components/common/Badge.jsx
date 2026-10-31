import React from "react";

export const VegBadge = ({ isVeg = true, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
        isVeg
          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
          : "bg-red-50 text-red-800 border border-red-300"
      } ${className}`}
      title={isVeg ? "100% Vegetarian" : "Non-Vegetarian"}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isVeg ? "bg-emerald-600" : "bg-red-600"
        }`}
      />
      {isVeg ? "Veg" : "Non-Veg"}
    </span>
  );
};

export const PromoBadge = ({ text, variant = "orange", className = "" }) => {
  const styles = {
    orange: "bg-[#F49A13] text-white shadow-sm",
    red: "bg-[#C92719] text-white shadow-sm",
    yellow: "bg-[#FFF0B8] text-[#941508] border border-[#E8D595]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
        styles[variant] || styles.orange
      } ${className}`}
    >
      {text}
    </span>
  );
};

