import Button from "@/components/Button";

/**
 * Generic selector component for choosing one option from a list
 * @param {Array} options - List of options (strings or {value, label} objects)
 * @param {string|*} selectedOption - Currently selected option value
 * @param {function} onOptionChange - Callback when option changes
 * @param {string} className - Additional CSS classes
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} border - Show border
 */
export default function CategorySelector({
  options = [],
  selectedOption,
  onOptionChange,
  className = "",
  size = "sm",
  border = true,
}) {
  // Support both string and object formats
  const isObjectFormat = options.length > 0 && typeof options[0] === "object";

  return (
    <div className={`flex ${border ? "border border-gray-200 p-1" : ""}  gap-2 w-fit ${className}`}>
      {options.map((option) => {
        const value = isObjectFormat ? option.value : option;
        const label = isObjectFormat ? option.label : option;

        return (
          <Button
            key={value}
            variant={selectedOption === value ? "primary" : "ghost" }
            size={size}
            type="button"
            onClick={() => onOptionChange(value)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
