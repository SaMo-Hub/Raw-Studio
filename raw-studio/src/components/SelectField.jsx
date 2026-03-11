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
  return (
    <div className={className}>
      {label && (
        <label 
          className="block text-xs font-medium mb-2 uppercase"

        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
className={`w-full px-2 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-black"
        } ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
      >
        {/* <option value="">-- Sélectionner une option --</option> */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
