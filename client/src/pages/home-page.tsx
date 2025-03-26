import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import ServicesSection from "@/components/home/services-section";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedProviders from "@/components/home/featured-providers";
import TestimonialsSection from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <HowItWorks />
        <FeaturedProviders />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
