import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@/pages/Products";
import { Button } from "./ui/button";
import { formatDate, generateReviewSummary } from "@/lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Props {
  productSlug: string;
  productSummary: string;
  productName: string;
}

export function AISummary({ productSlug, productSummary, productName }: Props) {
  const [summary, setSummary] = useState<string | null>(productSummary);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerateSummary() {
    try {
      setIsLoading(true);
      const response = await generateReviewSummary(productSlug);
      setSummary(response.summary);

      console.log("Generated summary response:", response);

      if (response.newly_created === true) {
        // Optionally, you can show a toast notification here indicating a new summary was created
        toast.success("A new AI summary successfully generated.");
      } else {
        toast.message(`${response.detail}`, {
          description: `The AI summary was last generated at ${formatDate(
            response.generated_at
          ).toLocaleString()}, try genrateting again by ${formatDate(
            response.next_allowed_at
          )}`,
        });
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="relative border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Top Action Button */}
      <div className="absolute -top-4 right-4">
        <Button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          size="sm"
          className="
          group
          flex items-center gap-2
          rounded-full
          bg-primary
          text-white
          shadow-md
          hover:shadow-lg
          transition-all
        "
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          )}
          Generate new summarized AI review
        </Button>
      </div>

      {summary && (
        <>
          <CardHeader className="pb-3 pt-8">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Review Summary
              <span className="text-muted-foreground font-normal">
                — {productName}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
