"use client";

import { useState, useEffect } from "react";

export default function StatusTag({ isActive, option = ["ACTIVE", "INACTIVE"], role = "status" }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 700);
    return () => clearTimeout(timeout);
  }, [isActive]);

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 ease-out inline-block overflow-hidden h-5 ${
        isActive
          ? role === "status"
            ? "bg-green-100 text-green-700"
            : `bg-blue-100 text-blue-700`
          : role === "status"
          ? "bg-gray-100 text-gray-700"
          : `bg-orange-100 text-orange-700`
      }`}
      style={{
        animation: animate ? 'statusPulse 0.3s ease-out' : 'none',
      }}
    >
      <span className="relative flex items-center justify-center overflow-hidden h-full">
        <span
          className={`block transition-transform duration-700 ease-out relative -top-0.1 left-0 right-0 ${
            isActive ? "translate-y-full" : "translate-y-0"
          }`}
        >
          {option[1]}
        </span>
        <span
          className={`block transition-transform text-center duration-700 ease-out absolute t -top-0.1 left-0 right-0 ${
            isActive ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {option[0]}
        </span>
      </span>
    </span>
  );
}
