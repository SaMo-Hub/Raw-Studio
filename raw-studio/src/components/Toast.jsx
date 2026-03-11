"use client";

import { useEffect, useState } from "react";

export function Toast({ message, type = "success", onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "error"
      ? "bg-red-50 border-red-200"
      : "bg-green-50 border-green-200";
  const textColor =
    type === "error"
      ? "text-red-700"
      : "text-green-700";
  const borderColor =
    type === "error"
      ? "border-l-red-500"
      : "";

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-md w-full ${bgColor} border ${borderColor}  p-4 animate-slide-in z-50`}
    >
      <p className={`text-sm font-medium ${textColor}`}>{message}</p>
    </div>
  );
}

export function ToastContainer({ messages, onDismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`${
            msg.type === "error"
              ? "bg-red-50 border-l-4 border-red-500 text-red-700"
              : "bg-green-50  text-green-700"
          } px-4 py-3  max-w-md pointer-events-auto animate-slide-in`}
          role="alert"
        >
          <p className="text-sm font-medium">{msg.text}</p>
        </div>
      ))}
    </div>
  );
}
