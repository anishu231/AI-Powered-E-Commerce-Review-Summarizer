
import { RatingStars } from "./RatingStars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Review } from "@/pages/Products";

interface RatingSummaryProps {
  reviews: Review[];
}

export function RatingSummary({ reviews }: RatingSummaryProps) {
  const totalReviews = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / totalReviews) * 100,
  }));

  return (
    <Card className="border-0 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-xl">Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-foreground">
              {avgRating.toFixed(1)}
            </p>
            <RatingStars rating={avgRating} size="md" className="mt-1" />
            <p className="mt-1 text-sm text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-muted-foreground">{rating}★</span>
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
