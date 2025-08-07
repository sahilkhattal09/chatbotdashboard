import React from "react";

interface LoaderProps {
  color?: string; // Optional border color, e.g., 'border-white'
  className?: string; // Optional custom classes
}

export const Loader: React.FC<LoaderProps> = ({
  color = "border-neutral-500",
  className = "",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent
                  w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${color} ${className}`}
    />
  );
};
