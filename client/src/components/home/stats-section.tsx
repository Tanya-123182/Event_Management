export default function StatsSection() {
  const stats = [
    { value: "5,000+", label: "Events Completed" },
    { value: "1,200+", label: "Service Providers" },
    { value: "4.8/5", label: "Average Rating" },
    { value: "15+", label: "Service Categories" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
