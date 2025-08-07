"use client";

import React from "react";
import { Loader } from "./Loader"; // adjust path as needed

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  loading = false,
  className = "",
  ...props
}) => {
  let variantClasses = "";

  switch (variant) {
    case "outline":
      variantClasses = "border border-neutral-400 hover:bg-neutral-100";
      break;
    case "ghost":
      variantClasses = "hover:bg-neutral-100";
      break;
    default:
      variantClasses = "bg-black text-white hover:bg-neutral-800";
  }

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${variantClasses} ${className}`}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};
