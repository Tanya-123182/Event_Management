import { Link } from "wouter";
import { ServiceProvider } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { ServiceCategory } from "@shared/schema";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProviderCardProps {
  provider: ServiceProvider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  // Fetch category information
  const { data: categories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  const category = categories?.find(cat => cat.id === provider.categoryId);

  // Format rating for display
  const formattedRating = provider.rating.toFixed(1);

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="text-amber-400 flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-4 w-4 fill-current" />}
      </div>
    );
  };

  // Get tags to display (max 3)
  const displayTags = Array.isArray(provider.tags) ? provider.tags.slice(0, 3) : [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
      <div className="h-56 w-full overflow-hidden relative">
        <img 
          src={provider.imageUrl || "https://via.placeholder.com/800x400?text=Service+Provider"} 
          className="w-full h-full object-cover" 
          alt={provider.companyName} 
        />
        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-lg flex items-center">
          <Star className="mr-1 h-4 w-4 text-amber-300 fill-current" /> 
          <span>{formattedRating}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 font-montserrat">{provider.companyName}</h3>
        <p className="mt-2 text-sm text-gray-500">
          {category?.name || "Service Provider"} • {provider.experience} years experience
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-primary-50 text-primary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-4 text-gray-600 text-sm line-clamp-3">
          {provider.description}
        </div>
        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-700 font-medium flex items-center">
            <MapPin className="text-secondary-500 mr-1 h-4 w-4" />
            {provider.location}
          </span>
          <Link href={`/provider/${provider.id}`}>
            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-500 hover:bg-secondary-600">
              View Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
