import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-block bg-blue-500 bg-opacity-40 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🎓 India's College Discovery Platform
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Find Your Perfect<br />College in India
          </h1>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            Explore 40+ top colleges, compare fees and placements, read real reviews, and make the best decision for your future.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/colleges" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition text-lg">
              Explore Colleges
            </Link>
            <Link href="/compare" className="border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition text-lg">
              Compare Colleges
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "40+", label: "Top Colleges" },
            { value: "15+", label: "States Covered" },
            { value: "100+", label: "Courses Listed" },
            { value: "Free", label: "Always Free" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything you need to decide</h2>
        <p className="text-gray-500 text-center mb-12">All the tools to make an informed college decision</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🔍", title: "Smart Search", desc: "Search and filter colleges by location, type, fees and ratings instantly." },
            { icon: "⚖️", title: "Compare Side-by-Side", desc: "Compare up to 3 colleges on fees, placements, ratings and more." },
            { icon: "📊", title: "Placement Data", desc: "Real placement statistics including average and highest packages." },
            { icon: "💬", title: "Student Reviews", desc: "Read authentic reviews from students who studied there." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Colleges Preview */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Top Ranked Colleges</h2>
          <p className="text-gray-500 text-center mb-12">Explore India's most prestigious institutions</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "IIT Bombay", location: "Mumbai, Maharashtra", rating: 4.8, pkg: "28 LPA", type: "Public" },
              { name: "IIT Madras", location: "Chennai, Tamil Nadu", rating: 4.8, pkg: "27 LPA", type: "Public" },
              { name: "IIIT Hyderabad", location: "Hyderabad, Telangana", rating: 4.5, pkg: "22 LPA", type: "Private" },
            ].map((c) => (
              <div key={c.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.type === "Public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>{c.type}</span>
                  <span className="text-yellow-500 font-medium text-sm">⭐ {c.rating}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{c.name}</h3>
                <p className="text-gray-500 text-sm mb-4">📍 {c.location}</p>
                <p className="text-blue-600 font-semibold text-sm">Avg Package: {c.pkg}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/colleges" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              View All 40 Colleges →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to find your college?</h2>
        <p className="text-gray-500 mb-8">Join thousands of students making smarter college decisions.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Get Started Free
          </Link>
          <Link href="/colleges" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
            Browse Colleges
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex justify-between items-center flex-wrap gap-4">
          <p className="text-gray-500 text-sm">🎓 CollegeDiscover — Find your perfect college</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/colleges" className="hover:text-gray-600">Colleges</Link>
            <Link href="/compare" className="hover:text-gray-600">Compare</Link>
            <Link href="/signup" className="hover:text-gray-600">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
