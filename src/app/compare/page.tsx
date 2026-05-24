"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  established: number;
  courses: { id: string; name: string; fees: number }[];
  placements: { averagePackage: number; highestPackage: number; placementRate: number }[];
  _count: { reviews: number };
}

interface AllCollege {
  id: string;
  name: string;
  location: string;
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("colleges") || "";

  const [allColleges, setAllColleges] = useState<AllCollege[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialId ? [initialId] : []);
  const [compared, setCompared] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/colleges").then((r) => r.json()).then(setAllColleges);
  }, []);

  async function compare() {
    if (selectedIds.length < 2) return;
    setLoading(true);
    const res = await fetch(`/api/colleges/compare?ids=${selectedIds.join(",")}`);
    const data = await res.json();
    setCompared(data);
    setLoading(false);
  }

  function toggleCollege(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  const rows = [
    { label: "Location", getValue: (c: College) => `${c.location}, ${c.state}` },
    { label: "Type", getValue: (c: College) => c.type },
    { label: "Established", getValue: (c: College) => c.established?.toString() || "N/A" },
    { label: "Annual Fees", getValue: (c: College) => `₹${(c.fees / 100000).toFixed(1)}L` },
    { label: "Rating", getValue: (c: College) => `⭐ ${c.rating}` },
    { label: "Avg Package", getValue: (c: College) => c.placements[0] ? `${c.placements[0].averagePackage} LPA` : "N/A" },
    { label: "Highest Package", getValue: (c: College) => c.placements[0] ? `${c.placements[0].highestPackage} LPA` : "N/A" },
    { label: "Placement Rate", getValue: (c: College) => c.placements[0] ? `${c.placements[0].placementRate}%` : "N/A" },
    { label: "Reviews", getValue: (c: College) => c._count.reviews.toString() },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/colleges" className="text-sm text-blue-600 hover:underline mb-3 inline-block">← Back to colleges</Link>
          <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
          <p className="text-gray-500 mt-1">Select 2–3 colleges to compare side by side</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* College Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Select Colleges ({selectedIds.length}/3)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {allColleges.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCollege(c.id)}
                className={`text-left p-3 rounded-lg border text-sm transition ${
                  selectedIds.includes(c.id)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <p className="font-medium leading-tight">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.location}</p>
              </button>
            ))}
          </div>
          <button
            onClick={compare}
            disabled={selectedIds.length < 2 || loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition"
          >
            {loading ? "Comparing..." : "Compare Now"}
          </button>
        </div>

        {/* Comparison Table */}
        {compared.length >= 2 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-gray-500 font-medium text-sm w-40">Feature</th>
                  {compared.map((c) => (
                    <th key={c.id} className="p-4 text-center">
                      <p className="font-bold text-gray-900 text-base">{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${c.type === "Public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>{c.type}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-4 text-sm font-medium text-gray-500">{row.label}</td>
                    {compared.map((c) => (
                      <td key={c.id} className="p-4 text-center text-sm font-semibold text-gray-800">
                        {row.getValue(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
