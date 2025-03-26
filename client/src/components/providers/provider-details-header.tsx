import { ServiceProvider, ServiceCategory } from "@shared/schema";
import { Star, MapPin, Award, Phone, Mail } from "lucide-react";

interface ProviderDetailsHeaderProps {
  provider: ServiceProvider;
  category?: ServiceCategory;
}

export default function ProviderDetailsHeader({ provider, category }: ProviderDetailsHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-64 w-full">
        <img 
          src={provider.imageUrl || "https://via.placeholder.com/1200x400?text=Service+Provider"} 
          alt={provider.companyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      <div className="relative -mt-20 px-6 pt-0 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 max-w-3xl">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-50 p-3 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 font-montserrat">{provider.companyName}</h1>
                <div className="flex items-center mt-1">
                  <span className="text-gray-600">{category?.name}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">{provider.experience} years experience</span>
                </div>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-600 text-sm">{provider.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-white py-2 px-4 rounded-lg shadow-md flex items-center">
              <Star className="h-5 w-5 text-amber-400 mr-1" />
              <span className="font-medium">{provider.rating.toFixed(1)}</span>
              <span className="text-gray-600 ml-1">({provider.reviewCount} reviews)</span>
            </div>
            
            <div className="bg-white py-2 px-4 rounded-lg shadow-md flex items-center">
              <Phone className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Contact</span>
            </div>
            
            <div className="bg-white py-2 px-4 rounded-lg shadow-md flex items-center">
              <Mail className="h-5 w-5 text-blue-500 mr-2" />
              <span className="font-medium">Message</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
