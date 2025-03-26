import { Review } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { format } from "date-fns";
import { Star, User as UserIcon } from "lucide-react";

interface ProviderReviewCardProps {
  review: Review;
}

export default function ProviderReviewCard({ review }: ProviderReviewCardProps) {
  // Fetch reviewer information
  const { data: reviewer } = useQuery<User>({
    queryKey: [`/api/user/${review.customerId}`],
    // Fall back to default user display if API doesn't exist
    enabled: false,
  });

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-current" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  // Format date
  const formattedDate = review.createdAt 
    ? format(new Date(review.createdAt), "MMM d, yyyy")
    : "Recently";

  const reviewerName = reviewer?.fullName || "Customer";
  const reviewerInitials = reviewerName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">{reviewerName}</h4>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          <div className="mt-1 mb-2">
            {renderStars(review.rating)}
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
