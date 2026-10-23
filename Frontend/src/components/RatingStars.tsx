import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  className,
}: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                "transition-colors",
                filled
                  ? "fill-rating text-rating"
                  : partial
                  ? "fill-rating/50 text-rating"
                  : "fill-rating-empty text-rating-empty"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
