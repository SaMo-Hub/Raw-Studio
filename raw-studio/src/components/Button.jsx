"use client";

import Link from "next/link";
import React from "react";

const Button = ({
  children,
  text,
  href,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const label = children || text;

  // Base styles with smooth transitions and overflow hidden for text animation
  const baseStyles =
    "font-medium uppercase focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden active:scale-95 hover:scale-105 transition-transform duration-200 ease-out";

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  // Color variants with smooth transitions
  const variantStyles = {
    primary: "bg-black text-white s transition-all duration-300",
    secondary: "border bg-white border-gray-300 text-gray-900 s transition-all duration-300",
    danger: "bg-red-600 text-white s transition-all duration-300",
    success: "bg-green-600 text-white s transition-all duration-300",
    ghost: "text-gray-900 transition-all duration-300",
  };

  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  // Text animation wrapper
  const textWrapperContent = (
    <span className="relative block h-full overflow-hidden">
      <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
        {label}
      </span>
      <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
        {label}
      </span>
    </span>
  );

  // If it's a link
  if (href) {
    return (
      <Link href={href} className={`group ${combinedClassName}`} {...props}>
        {textWrapperContent}
      </Link>
    );
  }

  // Regular button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group ${combinedClassName}`}
      {...props}
    >
      {textWrapperContent}
    </button>
  );
};

export default Button;
export { Button };
