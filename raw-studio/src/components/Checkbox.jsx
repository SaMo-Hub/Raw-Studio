import { useState, useEffect } from "react";

export default function Checkbox({ 
  checked = false, 
  onChange, 
  indeterminate = false,
  disabled = false,
  className = "",
  ...props 
}) {
  const [isChecked, setIsChecked] = useState(checked);
  const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    setIsIndeterminate(indeterminate);
  }, [indeterminate]);

  const handleChange = () => {
    if (!disabled) {
      setIsChecked(!isChecked);
      setIsIndeterminate(false);
      onChange?.({ target: { checked: !isChecked } });
    }
  };

  return (
    <button
      onClick={handleChange}
      disabled={disabled}
      className={`w-4 min-w-4 h-4 flex items-center justify-center border transition ${
        isChecked || isIndeterminate ? "bg-black border-black" : "bg-white border-gray-300 hover:border-gray-400"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      type="button"
      {...props}
    >
      {isIndeterminate && (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 10h14" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )}
      {isChecked && !isIndeterminate && (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

