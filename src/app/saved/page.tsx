"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  fees: number;
  rating: number;
  placements: { averagePackage: number }[];
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      fetch("/api/saved")
        .then((r) => r.json())
        .then((data) => { setColleges(data); setLoading(false); });
    }
  }, [status]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/colleges" className="text-sm text-blue-600 hover:underline mb-3 inline-block">← Back to colleges</Link>
          <h1 className="text-3xl font-bold text-gray-900">Saved Colleges</h1>
          <p className="text-gray-500 mt-1">{colleges.length} college{colleges.length !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {colleges.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No saved colleges yet</p>
            <Link href="/colleges" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">Browse Colleges</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Link href={`/colleges/${college.id}`} key={college.id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 cursor-pointer border border-transparent hover:border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${college.type === "Public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>{college.type}</span>
                    <span className="text-yellow-500 text-sm font-medium">⭐ {college.rating}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{college.name}</h2>
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
