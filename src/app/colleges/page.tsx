"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  fees: number;
  rating: number;
  description: string;
  placements: { averagePackage: number; placementRate: number }[];
  _count: { reviews: number };
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState("");
  const [sort, setSort] = useState("rating");

  async function fetchColleges() {
    setLoading(true);
    const params = new URLSearchParams({ search, type, state, sort });
    const res = await fetch(`/api/colleges?${params}`);
    const data = await res.json();
    setColleges(data);
    setLoading(false);
  }

  useEffect(() => { fetchColleges(); }, [search, type, state, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Discover Colleges</h1>
          <p className="text-gray-500 mt-1">Find the right college for you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Deemed">Deemed</option>
          </select>
          <select value={state} onChange={(e) => setState(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Rajasthan">Rajasthan</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="rating">Sort: Rating</option>
            <option value="fees">Sort: Fees</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading colleges...</div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No colleges found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Link href={`/colleges/${college.id}`} key={college.id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 h-full cursor-pointer border border-transparent hover:border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${college.type === "Public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                      {college.type}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                      ⭐ {college.rating}
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">{college.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">📍 {college.location}, {college.state}</p>
                  <div className="border-t pt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Annual Fees</p>
                      <p className="font-semibold text-gray-800">₹{(college.fees / 100000).toFixed(1)}L</p>
                    </div>
                    {college.placements[0] && (
                      <div>
                        <p className="text-gray-400 text-xs">Avg Package</p>
                        <p className="font-semibold text-gray-800">{college.placements[0].averagePackage} LPA</p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
