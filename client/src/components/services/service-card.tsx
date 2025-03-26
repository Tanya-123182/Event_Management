import { Link } from "wouter";
import { ServiceCategory } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { ServiceProvider } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";

interface ServiceCardProps {
  category: ServiceCategory;
}

export default function ServiceCard({ category }: ServiceCardProps) {
  // Fetch average rating for this category
  const { data: providers } = useQuery<ServiceProvider[]>({
    queryKey: [`/api/providers/category/${category.id}`],
  });

  // Calculate average rating
  const avgRating = providers?.length
    ? (providers.reduce((sum, provider) => sum + provider.rating, 0) / providers.length).toFixed(1)
    : "0.0";

  // Count reviews
  const reviewCount = providers?.reduce((sum, provider) => sum + provider.reviewCount, 0) || 0;

  // Render star rating
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="text-amber-400 flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-amber-400 stroke-current fill-none" />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={category.imageUrl || "https://via.placeholder.com/800x400?text=Event+Service"} 
          className="w-full h-full object-cover" 
          alt={category.name} 
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 font-montserrat">{category.name}</h3>
        <p className="mt-2 text-gray-600">{category.description}</p>
        <div className="mt-4 flex items-center gap-2">
          {renderStars(avgRating)}
          <span className="text-sm text-gray-500">{avgRating} ({reviewCount} reviews)</span>
        </div>
        <div className="mt-6">
          <Link href={`/providers?category=${category.id}`}>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100">
              View Providers 
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-2 h-4 w-4" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
