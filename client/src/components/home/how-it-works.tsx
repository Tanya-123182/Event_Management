export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Choose Event Type",
      description: "Select the type of event you want to organize from our diverse categories."
    },
    {
      number: 2,
      title: "Browse Providers",
      description: "Explore our verified service providers, check reviews and compare offerings."
    },
    {
      number: 3,
      title: "Contact & Book",
      description: "Reach out to providers, discuss your needs, and secure their services."
    },
    {
      number: 4,
      title: "Enjoy Your Event",
      description: "Relax and enjoy as professionals handle every aspect of your event."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat">How EventCraft Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Get your event organized in just a few simple steps
          </p>
        </div>
        
        <div className="mt-16">
          <div className="relative">
            {/* Process steps connection line (hidden on mobile) */}
            <div className="hidden md:block absolute top-1/2 w-full border-t-2 border-gray-200 -translate-y-1/2"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div 
                  key={step.number}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary text-2xl font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-montserrat">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
