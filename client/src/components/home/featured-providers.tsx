import { useQuery } from "@tanstack/react-query";
import { ServiceProvider } from "@shared/schema";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import ProviderCard from "../providers/provider-card";

export default function FeaturedProviders() {
  const { data: providers, isLoading, error } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/providers/top"],
  });

  if (isLoading) {
    return (
      <section id="providers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error || !providers) {
    return (
      <section id="providers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            Failed to load service providers. Please try again.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="providers" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">Top Rated Service Providers</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Meet our most highly rated event management professionals
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/providers">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700 shadow-md">
              See All Providers
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
