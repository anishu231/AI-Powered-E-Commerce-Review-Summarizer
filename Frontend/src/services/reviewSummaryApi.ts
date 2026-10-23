import { Review } from "@/data/products";

export interface ReviewSummaryResponse {
  summary: string;
}

/**
 * API service for generating AI review summaries.
 * Replace this implementation with your backend API call.
 */
export async function generateReviewSummary(
  productName: string,
  reviews: Review[]
): Promise<ReviewSummaryResponse> {
  // TODO: Replace with your actual API endpoint
  // Example:
  // const response = await fetch('/api/generate-summary', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ productName, reviews }),
  // });
  // return response.json();

  // Placeholder: Simulates API delay and returns mock summary
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const positiveThemes = reviews.filter(r => r.rating >= 4).slice(0, 3);
  const concerns = reviews.filter(r => r.rating < 4).slice(0, 2);

  let summary = `Customers rate the ${productName} an average of ${avgRating.toFixed(1)} out of 5 stars. `;
  
  if (positiveThemes.length > 0) {
    summary += `Buyers frequently praise the quality and value. `;
  }
  
  if (concerns.length > 0) {
    summary += `Some reviewers noted minor concerns about specific features. `;
  }
  
  summary += `Overall, this product receives positive feedback and is recommended by the majority of customers.`;

  return { summary };
}
