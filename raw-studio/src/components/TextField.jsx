export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  error = null,
  required = false,
  className = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor="description"
          className="block text-xs font-medium mb-2 uppercase"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full uppercase px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-black"
        } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
