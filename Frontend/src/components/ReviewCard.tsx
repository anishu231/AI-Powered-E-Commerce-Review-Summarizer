// import { Review } from "@/data/products";
import { Review } from "@/pages/Products";
import { RatingStars } from "./RatingStars";
import { format } from "date-fns";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-border py-5 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {review.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground">{review.author}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(review.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
        <RatingStars rating={review.rating} size="sm" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground pl-12">
        {review.comment}
      </p>
    </div>
  );
}
