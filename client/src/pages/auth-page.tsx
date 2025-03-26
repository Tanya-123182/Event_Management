import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AuthForms from "@/components/auth/auth-forms";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      if (user.userType === "customer") {
        setLocation("/dashboard/customer");
      } else {
        setLocation("/dashboard/provider");
      }
    }
  }, [user, isLoading, setLocation]);

  // If still loading, don't show anything
  if (isLoading) {
    return null;
  }

  // If user is already logged in, redirect them
  if (user) {
    return <Redirect to={user.userType === "customer" ? "/dashboard/customer" : "/dashboard/provider"} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-br from-primary to-accent-600 p-8 md:p-12 rounded-lg text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-6 font-montserrat">Welcome to EventCraft</h1>
              <p className="mb-4">
                Join our platform to connect with amazing event service providers or showcase your services to potential clients.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Browse and connect with 1,200+ service providers</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Rate and review services after your event</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Showcase your services and grow your business</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manage your events and bookings in one place</span>
                </li>
              </ul>
            </div>
            
            <div>
              <AuthForms />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
