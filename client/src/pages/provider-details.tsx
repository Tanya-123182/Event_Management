import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServiceProvider, Review, ServiceCategory, EventRequest } from "@shared/schema";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Loader2, Check, ChevronRight, Calendar, CreditCard, MessageSquare, Phone, Mail, MapPin, DollarSign, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import ProviderDetailsHeader from "@/components/providers/provider-details-header";
import ProviderReviewCard from "@/components/providers/provider-review-card";
import ReviewForm from "@/components/providers/review-form";
import EventRequestForm from "@/components/dashboard/event-request-form";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProviderDetails() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const providerId = parseInt(id);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [paymentAmount, setPaymentAmount] = useState<string>("100");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

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

  // Format the contactInfo to show as a phone number if it's digits only
  const formatContactInfo = (info: string | null) => {
    if (!info) return "Contact information not available";
    
    // If info contains only digits, format as phone number
    if (/^\d+$/.test(info)) {
      const digits = info.replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
    }
    return info;
  };

  // Extract phone and email if they exist in contactInfo
  const getContactDetails = () => {
    if (!provider?.contactInfo) return { phone: null, email: null, other: "Contact information not available" };
    
    const emailMatch = provider.contactInfo.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/);
    const phoneMatch = provider.contactInfo.match(/\d{10}/);
    
    return {
      phone: phoneMatch ? phoneMatch[0] : null,
      email: emailMatch ? emailMatch[0] : null,
      other: provider.contactInfo
    };
  };

  const contactDetails = getContactDetails();

  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmittingPayment(false);
      toast({
        title: "Payment Successful",
        description: `You have successfully paid $${paymentAmount} to ${provider?.companyName}`,
        variant: "default",
      });
    }, 1500);
  };

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
      <main className="flex-grow py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProviderDetailsHeader provider={provider} category={category} />
          
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area - About, Reviews, Request Tabs */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="bg-white rounded-lg shadow-sm">
                <TabsList className="w-full border-b p-0 mb-0 overflow-x-auto">
                  <TabsTrigger value="about" className="rounded-none py-3">About</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none py-3">
                    Reviews ({provider.reviewCount})
                  </TabsTrigger>
                  {user && user.userType === "customer" && (
                    <TabsTrigger value="request" className="rounded-none py-3">Request Service</TabsTrigger>
                  )}
                  {user && user.userType === "customer" && (
                    <TabsTrigger value="payment" className="rounded-none py-3">Make Payment</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="about" className="p-4 sm:p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About {provider.companyName}</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700">{provider.description}</p>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Service Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <Badge key={index} variant="outline" className="bg-primary-50 text-primary border-primary-100">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="p-4 sm:p-6">
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
                  <TabsContent value="request" className="p-4 sm:p-6" id="request-service">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Request Service from {provider.companyName}</h3>
                    <p className="text-gray-600 mb-6">
                      Fill out the form below to request this service provider for your event.
                    </p>
                    
                    <EventRequestForm providerId={providerId} categoryId={provider.categoryId} />
                  </TabsContent>
                )}

                {user && user.userType === "customer" && (
                  <TabsContent value="payment" className="p-4 sm:p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Make a Payment to {provider.companyName}</h3>
                    <p className="text-gray-600 mb-6">
                      Use this secure form to make a payment for services provided. All transactions are secure and free of charge.
                    </p>
                    
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Payment Amount ($)</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              <DollarSign className="h-5 w-5 text-gray-400" />
                            </span>
                            <Input
                              id="amount"
                              type="number"
                              min="1"
                              step="0.01"
                              className="pl-10"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Payment Method</Label>
                          <RadioGroup 
                            value={paymentMethod} 
                            onValueChange={setPaymentMethod}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            <div>
                              <RadioGroupItem 
                                value="credit_card" 
                                id="credit_card" 
                                className="peer sr-only" 
                              />
                              <Label
                                htmlFor="credit_card"
                                className="flex items-center p-4 border border-gray-200 rounded-lg peer-checked:border-primary peer-checked:bg-primary-50 cursor-pointer"
                              >
                                <CreditCard className="h-5 w-5 mr-3 text-primary" />
                                <span>Credit/Debit Card</span>
                                {paymentMethod === "credit_card" && (
                                  <Check className="h-4 w-4 ml-auto text-primary" />
                                )}
                              </Label>
                            </div>
                            
                            <div>
                              <RadioGroupItem 
                                value="bank_transfer" 
                                id="bank_transfer" 
                                className="peer sr-only" 
                              />
                              <Label
                                htmlFor="bank_transfer"
                                className="flex items-center p-4 border border-gray-200 rounded-lg peer-checked:border-primary peer-checked:bg-primary-50 cursor-pointer"
                              >
                                <BadgeCheck className="h-5 w-5 mr-3 text-primary" />
                                <span>Bank Transfer</span>
                                {paymentMethod === "bank_transfer" && (
                                  <Check className="h-4 w-4 ml-auto text-primary" />
                                )}
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-medium mb-2 flex items-center text-green-700">
                            <BadgeCheck className="h-4 w-4 mr-1" /> Fee-Free Payment
                          </h4>
                          <p className="text-sm text-gray-600">
                            No transaction fees are charged for payments made on our platform.
                          </p>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmittingPayment}
                      >
                        {isSubmittingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Pay ${paymentAmount}</>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                )}
              </Tabs>
            </div>
            
            {/* Sidebar - Contact Information and Quick Actions */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription>Get in touch with {provider.companyName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactDetails.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a 
                          href={`tel:${contactDetails.phone}`}
                          className="text-gray-700 hover:text-primary transition-colors"
                        >
                          {formatContactInfo(contactDetails.phone)}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contactDetails.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href={`mailto:${contactDetails.email}`}
                          className="text-gray-700 hover:text-primary transition-colors"
                        >
                          {contactDetails.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-700">{provider.location}</p>
                    </div>
                  </div>
                  
                  {!contactDetails.phone && !contactDetails.email && (
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Other Contact</p>
                        <p className="text-gray-700">{contactDetails.other}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              {user && user.userType === "customer" && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => {
                        const element = document.getElementById('request-service');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          const tabTrigger = document.querySelector('[value="request"]') as HTMLElement;
                          if (tabTrigger) tabTrigger.click();
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book This Service
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => {
                        const tabTrigger = document.querySelector('[value="payment"]') as HTMLElement;
                        if (tabTrigger) tabTrigger.click();
                      }}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Make a Payment
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => {
                        const element = document.getElementById('write-review');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          const tabTrigger = document.querySelector('[value="reviews"]') as HTMLElement;
                          if (tabTrigger) tabTrigger.click();
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Write a Review
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
