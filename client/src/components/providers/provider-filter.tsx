import { ServiceCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ProviderFilterProps {
  categories: ServiceCategory[];
  selectedCategory: number | null;
  onFilterChange: (categoryId: number | null) => void;
}

export default function ProviderFilter({ 
  categories, 
  selectedCategory, 
  onFilterChange 
}: ProviderFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Filter by category</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="text-sm"
          onClick={() => onFilterChange(null)}
        >
          All Categories
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className="text-sm"
            onClick={() => onFilterChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
