import { useState, useRef } from "react";

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  error = null,
  required = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      selectRef.current?.click();
    }
  };

  const handleChange = (e) => {
    onChange(e);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium mb-2 uppercase">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={selectRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          className={`w-full px-2 py-2 uppercase pr-8 border appearance-none border-gray-300 focus:outline-none focus:ring-2 focus:ring-black ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-black"
          } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "cursor-pointer"}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <div
          className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${disabled ? "text-gray-400" : "text-gray-700"}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 5L7 9.5L11.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}