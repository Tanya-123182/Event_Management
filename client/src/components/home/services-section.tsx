import { useQuery } from "@tanstack/react-query";
import { ServiceCategory } from "@shared/schema";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import ServiceCard from "../services/service-card";

export default function ServicesSection() {
  const { data: categories, isLoading, error } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error || !categories) {
    return (
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            Failed to load service categories. Please try again.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">Our Event Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover our wide range of event management services tailored to make your special occasions memorable.
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <ServiceCard key={category.id} category={category} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/services">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700 shadow-md">
              Explore All Services
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
