import Button from "@/components/Button";

const CATEGORIES = ["COMMERCIAL", "MUSIC VIDEO", "WEB"];

export default function CategorySelector({ selectedCategories, onCategoryChange }) {
  return (
    <div className="flex border mt-4 border-gray-300 p-1 gap-2 flex-wrap text-xs">
      {CATEGORIES.map((cat) => (
        <Button
          variant={selectedCategories.includes(cat) ? "primary" : "ghost"}
          size="sm"
          key={cat}
          type="button"
          onClick={() => onCategoryChange(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
