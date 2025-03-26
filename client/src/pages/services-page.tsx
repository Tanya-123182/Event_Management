import { useQuery } from "@tanstack/react-query";
import { ServiceCategory } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ServiceCard from "@/components/services/service-card";
import { Loader2 } from "lucide-react";

export default function ServicesPage() {
  const { data: categories, isLoading, error } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 font-montserrat">Our Event Services</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Discover the perfect event service for your special occasion. We offer a wide range of options to meet your needs.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center mt-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center mt-16 text-red-500">
              Failed to load services. Please try again later.
            </div>
          ) : (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <ServiceCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
