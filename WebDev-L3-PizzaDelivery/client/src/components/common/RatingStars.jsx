import React from "react";
import { Star } from "lucide-react";

export const RatingStars = ({ rating = 4.8, reviews = null, size = 15, showNumber = true }) => {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[#7A5C55]">
      <div className="flex items-center text-[#F49A13]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i < Math.floor(rating)
                ? "fill-[#F49A13] text-[#F49A13]"
                : i < rating
                ? "fill-[#F49A13]/50 text-[#F49A13]"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="font-semibold text-[#351B17]">{rating.toFixed(1)}</span>
      )}
      {reviews && (
        <span className="text-[#7A5C55]">({reviews}+ reviews)</span>
      )}
    </div>
  );
};

