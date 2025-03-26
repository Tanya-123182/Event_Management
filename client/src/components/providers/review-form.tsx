import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Star } from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Please write a comment of at least 10 characters").max(500, "Comment must be less than 500 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  providerId: number;
}

export default function ReviewForm({ providerId }: ReviewFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      const res = await apiRequest("POST", "/api/reviews", {
        providerId: providerId,
        rating: values.rating,
        comment: values.comment,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for sharing your experience!",
      });
      
      // Reset form
      form.reset();
      
      // Invalidate provider details and reviews cache to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/providers/${providerId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/provider/${providerId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }
    
    reviewMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating</FormLabel>
              <FormControl>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= (hoveredRating || field.value) 
                          ? "text-amber-400 fill-current" 
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your experience with this service provider..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={reviewMutation.isPending}
        >
          {reviewMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </form>
    </Form>
  );
}
