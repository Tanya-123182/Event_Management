import React from "react";
import { CheckCircle, Calendar, UserCheck, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BookingSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerName: string;
  eventTitle?: string;
  eventDate?: Date;
}

export default function BookingSuccessModal({
  open,
  onOpenChange,
  providerName,
  eventTitle,
  eventDate,
}: BookingSuccessModalProps) {
  const [, navigate] = useLocation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">Booking Successful!</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Your event has been successfully booked with {providerName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {eventTitle && (
            <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
              <Calendar className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{eventTitle}</p>
                {eventDate && <p className="text-xs text-gray-500">{eventDate.toLocaleDateString()}</p>}
              </div>
            </div>
          )}
          
          <div className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50">
            <UserCheck className="h-5 w-5 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Service Provider</p>
              <p className="text-xs text-gray-500">{providerName}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
            <p className="font-medium">What happens next?</p>
            <p className="mt-1">
              The service provider will review your request and contact you to finalize the details. 
              You can view your booking status in your customer dashboard.
            </p>
          </div>
        </div>
        
        <DialogFooter className="mt-6 flex gap-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Close
          </Button>
          <Button 
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate("/dashboard/customer");
            }}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}