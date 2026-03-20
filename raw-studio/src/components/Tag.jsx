"use client";

export default function Tag({ label, index = 0 }) {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-700",
    "bg-indigo-100 text-indigo-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const colorClass = colors[index % colors.length];

  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 inline-block ${colorClass}`}>
      {label}
    </span>
  );
}
