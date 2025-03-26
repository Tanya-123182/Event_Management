import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServiceProvider, ServiceCategory, EventRequest } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import RequestCard from "@/components/dashboard/request-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Loader2, 
  Building, 
  Star, 
  Users,
  Clock,
  UserCircle,
  BarChart,
  BadgeCheck
} from "lucide-react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [providerId, setProviderId] = useState<number | null>(null);
  
  // Fetch provider profile
  const { data: providerProfile, isLoading: isLoadingProfile } = useQuery<ServiceProvider>({
    queryKey: [`/api/providers/user/${user?.id}`],
    enabled: !!user?.id,
    onSuccess: (data) => {
      if (data) {
        setProviderId(data.id);
      }
    }
  });

  // Fetch provider's event requests
  const { 
    data: requests, 
    isLoading: isLoadingRequests 
  } = useQuery<EventRequest[]>({
    queryKey: ["/api/requests/provider"],
    enabled: !!providerId,
  });

  // Fetch category
  const { data: categories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Get category name
  const categoryName = categories?.find(
    cat => cat.id === providerProfile?.categoryId
  )?.name || "Event Service";

  // Filter requests based on active tab
  const filteredRequests = requests?.filter(request => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return request.status === "pending";
    if (activeTab === "accepted") return request.status === "accepted";
    if (activeTab === "completed") return request.status === "completed";
    return false;
  });

  // Get stats
  const totalRequests = requests?.length || 0;
  const pendingRequests = requests?.filter(r => r.status === "pending").length || 0;
  const acceptedRequests = requests?.filter(r => r.status === "accepted").length || 0;
  const completedRequests = requests?.filter(r => r.status === "completed").length || 0;

  // Get company initials for avatar
  const companyInitials = providerProfile?.companyName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || user?.fullName.charAt(0).toUpperCase() || "P";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4 bg-primary-100 text-primary">
                  <AvatarFallback>{companyInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {providerProfile?.companyName || "Loading..."}
                  </h1>
                  <p className="text-gray-600">
                    {categoryName} • {providerProfile?.experience || 0} years experience
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="ml-1 text-gray-700">
                        {providerProfile?.rating.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-700">
                      {providerProfile?.reviewCount || 0} reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Accepted</p>
                  <p className="text-3xl font-bold text-green-600">{acceptedRequests}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BadgeCheck className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-3xl font-bold text-blue-600">{completedRequests}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Requests */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Event Requests</CardTitle>
              <CardDescription>
                Manage customer requests for your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  {isLoadingRequests || isLoadingProfile ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredRequests && filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredRequests.map((request) => (
                        <RequestCard 
                          key={request.id} 
                          request={request} 
                          viewType="provider" 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-md">
                      <UserCircle className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {activeTab === "all"
                          ? "You don't have any event requests yet."
                          : `You don't have any ${activeTab} requests.`}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
