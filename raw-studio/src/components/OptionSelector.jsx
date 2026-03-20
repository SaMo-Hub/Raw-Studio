import Button from "@/components/Button";

export default function OptionSelector({ options, selectedValue, onValueChange, isSingleSelect = true, disabled = false }) {
  const handleChange = (option) => {
    if (disabled) return; // Ignore changes if disabled
    if (isSingleSelect) {
      onValueChange(option);
    } else {
      // Pour multi-select
      if (Array.isArray(selectedValue)) {
        if (selectedValue.includes(option)) {
          onValueChange(selectedValue.filter((item) => item !== option));
        } else {
          onValueChange([...selectedValue, option]);
        }
      }
    }
  };

  const isSelected = (option) => {
    if (isSingleSelect) {
      return selectedValue === option;
    } else {
      return Array.isArray(selectedValue) && selectedValue.includes(option);
    }
  };

  return (
    <div className={`flex border mt-4 w-fit border-gray-300 p-1 gap-2 text-xs ${disabled ? "opacity-50" : ""}`}>
      {options.map((option) => (
        <Button
          variant={isSelected(option) ? "primary" : "ghost"}
          size="sm"
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => handleChange(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
