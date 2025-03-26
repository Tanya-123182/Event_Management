import { useQuery } from "@tanstack/react-query";
import { ServiceProvider, Review, ServiceCategory, EventRequest } from "@shared/schema";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import ProviderDetailsHeader from "@/components/providers/provider-details-header";
import ProviderReviewCard from "@/components/providers/provider-review-card";
import ReviewForm from "@/components/providers/review-form";
import EventRequestForm from "@/components/dashboard/event-request-form";

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const providerId = parseInt(id);

  // Fetch provider details
  const { data: provider, isLoading: isLoadingProvider } = useQuery<ServiceProvider>({
    queryKey: [`/api/providers/${providerId}`],
    onError: () => {
      // Redirect to 404 on error
      navigate("/not-found");
    }
  });

  // Fetch provider reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: [`/api/reviews/provider/${providerId}`],
    enabled: !!provider,
  });

  // Fetch categories for category name
  const { data: categories, isLoading: isLoadingCategories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
    enabled: !!provider,
  });

  const isLoading = isLoadingProvider || isLoadingReviews || isLoadingCategories;

  // Find the category for this provider
  const category = provider && categories 
    ? categories.find(cat => cat.id === provider.categoryId) 
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-16 bg-gray-50 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!provider) {
    return null; // The navigate in onError will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProviderDetailsHeader provider={provider} category={category} />
          
          <div className="mt-8">
            <Tabs defaultValue="about" className="bg-white rounded-lg shadow-sm">
              <TabsList className="w-full border-b p-0 mb-0">
                <TabsTrigger value="about" className="flex-1 rounded-none py-3">About</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 rounded-none py-3">
                  Reviews ({provider.reviewCount})
                </TabsTrigger>
                {user && user.userType === "customer" && (
                  <TabsTrigger value="request" className="flex-1 rounded-none py-3">Request Service</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="about" className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About {provider.companyName}</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">{provider.description}</p>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Service Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{category?.name || "Event Service"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="font-medium">{provider.experience} years</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{provider.location}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-medium">{provider.rating.toFixed(1)} / 5.0</p>
                      </div>
                    </div>
                  </div>
                  
                  {Array.isArray(provider.tags) && provider.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-50 text-primary rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h4>
                    <p className="text-gray-700">{provider.contactInfo}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                  {user && user.userType === "customer" && (
                    <Button
                      size="sm"
                      className="ml-auto"
                      onClick={() => {
                        document.getElementById('write-review')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Write a Review
                    </Button>
                  )}
                </div>
                
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ProviderReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-md">
                    <h4 className="text-lg font-medium text-gray-900">No Reviews Yet</h4>
                    <p className="text-gray-600 mt-2">Be the first to review this service provider.</p>
                  </div>
                )}
                
                {user && user.userType === "customer" && (
                  <div id="write-review" className="mt-10 pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Leave a Review</h3>
                    <ReviewForm providerId={providerId} />
                  </div>
                )}
              </TabsContent>
              
              {user && user.userType === "customer" && (
                <TabsContent value="request" className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Request Service from {provider.companyName}</h3>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below to request this service provider for your event.
                  </p>
                  
                  <EventRequestForm providerId={providerId} categoryId={provider.categoryId} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
