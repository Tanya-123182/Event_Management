import { ServiceProvider, ServiceCategory } from "@shared/schema";
import { Star, MapPin, Award, Phone, Mail, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProviderDetailsHeaderProps {
  provider: ServiceProvider;
  category?: ServiceCategory;
}

export default function ProviderDetailsHeader({ provider, category }: ProviderDetailsHeaderProps) {
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

  // Extract contact info
  const contactInfo = formatContactInfo(provider.contactInfo);
  const phoneNumber = provider.contactInfo && /^\d+$/.test(provider.contactInfo) 
    ? `tel:${provider.contactInfo}` 
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-48 sm:h-64 md:h-80 w-full">
        <img 
          src={provider.imageUrl || "https://via.placeholder.com/1200x400?text=Service+Provider"} 
          alt={provider.companyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      
      <div className="relative -mt-20 px-4 sm:px-6 pt-0 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-shrink-0 bg-primary-50 p-3 rounded-full mb-4 sm:mb-0">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="sm:ml-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-montserrat">{provider.companyName}</h1>
                <div className="flex flex-wrap items-center mt-1 gap-2">
                  <span className="text-gray-600">{category?.name}</span>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="text-gray-600">{provider.experience} years experience</span>
                </div>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{provider.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <div className="bg-white py-2 px-3 sm:px-4 rounded-lg shadow-md flex items-center">
              <Star className="h-5 w-5 text-amber-400 mr-1" />
              <span className="font-medium">{provider.rating ? provider.rating.toFixed(1) : "0.0"}</span>
              <span className="text-gray-600 ml-1">({provider.reviewCount} reviews)</span>
            </div>
            
            {phoneNumber ? (
              <a 
                href={phoneNumber}
                className="bg-white py-2 px-3 sm:px-4 rounded-lg shadow-md flex items-center hover:bg-gray-50 transition-colors"
              >
                <Phone className="h-5 w-5 text-green-500 mr-1 sm:mr-2" />
                <span className="font-medium">Call Now</span>
              </a>
            ) : (
              <div className="bg-white py-2 px-3 sm:px-4 rounded-lg shadow-md flex items-center">
                <Phone className="h-5 w-5 text-green-500 mr-1 sm:mr-2" />
                <span className="font-medium">Contact</span>
              </div>
            )}
            
            <Link href="#request-service">
              <Button className="py-2 px-3 sm:px-4 h-auto flex gap-2 items-center">
                <Calendar className="h-5 w-5" />
                <span>Book Now</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Contact card - visible on mobile, hidden on larger screens */}
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 md:hidden">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <User className="h-4 w-4 mr-1" />
            Contact Information
          </h3>
          <div className="flex items-start">
            <Phone className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-gray-800">{contactInfo}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
