import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent-600 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-montserrat leading-tight">
            Creating Memorable <span className="text-secondary-300">Events</span> Made Easy
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white opacity-90">
            Connect with top event providers for weddings, birthdays, corporate events and more. Start planning your perfect event today!
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth?type=customer">
              <button className="px-8 py-4 bg-white text-primary rounded-lg shadow-lg font-medium hover:bg-gray-100 transition-all transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                </svg>
                Register as Customer
              </button>
            </Link>
            <Link href="/auth?type=provider">
              <button className="px-8 py-4 bg-secondary-500 text-white rounded-lg shadow-lg font-medium hover:bg-secondary-600 transition-all transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                Register as Provider
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#f9fafb" fillOpacity="1" d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
