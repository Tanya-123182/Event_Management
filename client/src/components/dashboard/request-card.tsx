import { EventRequest } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { ServiceProvider, ServiceCategory } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Tag, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";

interface RequestCardProps {
  request: EventRequest;
  viewType: "customer" | "provider";
}

export default function RequestCard({ request, viewType }: RequestCardProps) {
  const { toast } = useToast();

  // Fetch provider details if needed
  const { data: provider } = useQuery<ServiceProvider>({
    queryKey: [`/api/providers/${request.providerId}`],
    enabled: !!request.providerId,
  });

  // Fetch category details
  const { data: category } = useQuery<ServiceCategory>({
    queryKey: [`/api/categories/${request.categoryId}`],
  });

  // Status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/requests/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "The request status has been updated successfully.",
      });
      
      // Invalidate requests cache to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/requests/customer"] });
      queryClient.invalidateQueries({ queryKey: ["/api/requests/provider"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle status update
  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate({ id: request.id, status });
  };

  // Format event date
  const formattedEventDate = request.eventDate 
    ? format(new Date(request.eventDate), "MMMM d, yyyy")
    : "Date not specified";

  // Format created date
  const formattedCreatedDate = request.createdAt 
    ? format(new Date(request.createdAt), "MMM d, yyyy")
    : "Recently";

  // Determine status badge color and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          color: "bg-yellow-100 text-yellow-800", 
          icon: <AlertCircle className="h-4 w-4 mr-1" /> 
        };
      case "accepted":
        return { 
          color: "bg-green-100 text-green-800", 
          icon: <CheckCircle className="h-4 w-4 mr-1" /> 
        };
      case "completed":
        return { 
          color: "bg-blue-100 text-blue-800", 
          icon: <CheckCircle className="h-4 w-4 mr-1" /> 
        };
      case "cancelled":
        return { 
          color: "bg-red-100 text-red-800", 
          icon: <XCircle className="h-4 w-4 mr-1" /> 
        };
      default:
        return { 
          color: "bg-gray-100 text-gray-800", 
          icon: <AlertCircle className="h-4 w-4 mr-1" /> 
        };
    }
  };

  const statusBadge = getStatusBadge(request.status);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{request.title}</CardTitle>
          <Badge 
            variant="outline" 
            className={`${statusBadge.color} flex items-center capitalize`}
          >
            {statusBadge.icon}
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            Event Date: {formattedEventDate}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Requested on: {formattedCreatedDate}
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Tag className="h-4 w-4 mr-2" />
            Category: {category?.name || "Event Service"}
          </div>

          {viewType === "customer" && provider && (
            <div className="mt-2 font-medium">
              Provider: {provider.companyName}
            </div>
          )}

          <p className="mt-2 text-gray-700 line-clamp-3">{request.description}</p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-end gap-2">
        {viewType === "provider" && request.status === "pending" && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={updateStatusMutation.isPending}
            >
              Decline
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleStatusUpdate("accepted")}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Accept"
              )}
            </Button>
          </>
        )}
        
        {viewType === "provider" && request.status === "accepted" && (
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate("completed")}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Mark as Completed"
            )}
          </Button>
        )}
        
        {viewType === "customer" && request.status === "pending" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleStatusUpdate("cancelled")}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Cancel Request"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
