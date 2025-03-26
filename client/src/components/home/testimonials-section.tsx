export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "The wedding planning service we found through EventCraft exceeded all our expectations. They took care of every detail and made our special day absolutely perfect!",
      author: "Sarah & Michael",
      role: "Wedding Clients",
      initials: "SM",
      rating: 5
    },
    {
      quote: "Finding the right team for our corporate retreat was a breeze with EventCraft. The platform connected us with professionals who delivered a seamless experience for our team.",
      author: "James Thompson",
      role: "Marketing Director",
      initials: "JT",
      rating: 5
    },
    {
      quote: "My daughter's sweet sixteen party was an absolute hit thanks to the amazing birthday event specialists we found on EventCraft. They created a magical experience we'll never forget!",
      author: "Lisa Peterson",
      role: "Birthday Client",
      initials: "LP",
      rating: 4.5
    },
    {
      quote: "We celebrated our 25th anniversary in style thanks to EventCraft. The platform helped us find an event planner who coordinated a beautiful, intimate celebration exactly as we envisioned.",
      author: "Robert & Jennifer",
      role: "Anniversary Clients",
      initials: "RJ",
      rating: 5
    }
  ];

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="text-amber-300 flex mb-4">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-accent-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-montserrat">What Our Customers Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
            Read about the experiences of people who've used our platform
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm hover:bg-opacity-20 transition-all"
            >
              {renderStars(testimonial.rating)}
              <p className="italic">{testimonial.quote}</p>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800">
                    <span>{testimonial.initials}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm opacity-80">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
