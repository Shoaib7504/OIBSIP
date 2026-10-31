import React from "react";

export const BasilIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M19.5 4.5C14.5 4 8.5 7.5 6 12C3.5 16.5 5 20.5 7 21C9 21.5 13 20 16.5 16C20 12 20.5 7 19.5 4.5Z"
      fill="#2E7D32"
    />
    <path
      d="M6 12C9 13.5 14 13.5 19.5 4.5"
      stroke="#81C784"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 13C12 11 15 10 17 8"
      stroke="#81C784"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const TomatoIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="13" r="8.5" fill="#D32F2F" />
    <circle cx="12" cy="13" r="5" stroke="#FFCDD2" strokeWidth="1" strokeDasharray="2 1.5" />
    <path
      d="M12 4.5V2.5M10 3.5C11 4.5 13 4.5 14 3.5M8 4.5C10 5.5 14 5.5 16 4.5"
      stroke="#2E7D32"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="10" cy="12" r="1" fill="#FFCDD2" />
    <circle cx="14" cy="12" r="1" fill="#FFCDD2" />
    <circle cx="12" cy="15" r="1" fill="#FFCDD2" />
  </svg>
);

export const CheeseIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 17.5L12 4L21 17.5C21 17.5 12 19.5 3 17.5Z"
      fill="#FFA000"
    />
    <path
      d="M3 17.5L5 20.5C11 22 17 22 21 20.5L21 17.5C12 19.5 3 17.5 3 17.5Z"
      fill="#FF8F00"
    />
    <circle cx="9" cy="13" r="1.5" fill="#FFE082" />
    <circle cx="15" cy="15" r="1.8" fill="#FFE082" />
    <circle cx="13" cy="9" r="1" fill="#FFE082" />
  </svg>
);

export const MushroomIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Cap */}
    <path
      d="M4 14C4 8.5 7.5 5 12 5C16.5 5 20 8.5 20 14H4Z"
      fill="#8D6E63"
    />
    {/* Cap spots */}
    <circle cx="8" cy="10" r="1.5" fill="#D7CCC8" opacity="0.8" />
    <circle cx="13" cy="8.5" r="1.2" fill="#D7CCC8" opacity="0.8" />
    <circle cx="16.5" cy="11" r="1" fill="#D7CCC8" opacity="0.8" />
    {/* Stem */}
    <path
      d="M9.5 14V18.5C9.5 19.5 10.5 20 12 20C13.5 20 14.5 19.5 14.5 18.5V14"
      fill="#EFEBE9"
      stroke="#BCAAA4"
      strokeWidth="1"
    />
  </svg>
);

export const ChiliIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M17 5C15 7 11 12 9 16C7 20 5 21 5 21C5 21 8 19 11 16C14 13 18 8 19 5L17 5Z"
      fill="#C62828"
    />
    <path
      d="M18 4C19 2.5 20 2 21 2M16 4.5C17.5 5.5 19.5 4.5 19.5 4.5"
      stroke="#2E7D32"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

