import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServiceProvider, ServiceCategory } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProviderCard from "@/components/providers/provider-card";
import ProviderFilter from "@/components/providers/provider-filter";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ProvidersPage() {
  const [location] = useLocation();
  // Get category filter from URL if exists
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryParam = searchParams.get("category");
  
  const [categoryFilter, setCategoryFilter] = useState<number | null>(
    categoryParam ? parseInt(categoryParam) : null
  );
  
  // Fetch all providers
  const { data: providers, isLoading: isLoadingProviders } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/providers"],
  });

  // Fetch all categories for filtering
  const { data: categories, isLoading: isLoadingCategories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Filter providers by category if needed
  const filteredProviders = categoryFilter
    ? providers?.filter(provider => provider.categoryId === categoryFilter)
    : providers;

  // Handle filter change
  const handleFilterChange = (categoryId: number | null) => {
    setCategoryFilter(categoryId);
  };

  const isLoading = isLoadingProviders || isLoadingCategories;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 font-montserrat">Event Service Providers</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Browse our network of professional event service providers and find the perfect match for your event
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center mt-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="mt-8">
                <ProviderFilter 
                  categories={categories || []} 
                  selectedCategory={categoryFilter} 
                  onFilterChange={handleFilterChange} 
                />
              </div>
              
              {filteredProviders && filteredProviders.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              ) : (
                <div className="mt-16 text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-900">No providers found</h3>
                  <p className="mt-2 text-gray-600">
                    {categoryFilter 
                      ? "No providers available for the selected category. Please try another category."
                      : "No service providers available at the moment. Please check back later."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
