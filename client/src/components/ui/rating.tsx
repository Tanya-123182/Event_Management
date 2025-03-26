import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  className,
  showValue = false,
}: RatingProps) {
  // Determine size in pixels
  const sizeInPx = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];
  
  // Calculate full stars, half stars, and empty stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex text-yellow-400">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={sizeInPx} fill="currentColor" />
        ))}
        
        {/* Half star */}
        {hasHalfStar && <StarHalf key="half" size={sizeInPx} fill="currentColor" />}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={sizeInPx} className="text-gray-300" />
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-600">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
