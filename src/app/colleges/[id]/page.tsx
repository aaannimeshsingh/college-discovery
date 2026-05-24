"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  website: string;
  courses: { id: string; name: string; duration: number; fees: number; seats: number }[];
  placements: { year: number; averagePackage: number; highestPackage: number; placementRate: number }[];
  reviews: { id: string; rating: number; content: string; createdAt: string; user: { name: string } }[];
}

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [review, setReview] = useState({ rating: 5, content: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/colleges/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCollege({
          ...data,
          courses: data.courses || [],
          placements: data.placements || [],
          reviews: data.reviews || [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (session) {
      fetch(`/api/saved/${id}`)
        .then((r) => r.json())
        .then((data) => setSaved(data.saved))
        .catch(() => {});
    }
  }, [id, session]);

  async function toggleSave() {
    if (!session) { router.push("/login"); return; }
    const method = saved ? "DELETE" : "POST";
    await fetch(`/api/saved/${id}`, { method });
    setSaved(!saved);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/login"); return; }
    setSubmitting(true);
    const res = await fetch(`/api/colleges/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (res.ok) {
      const updated = await fetch(`/api/colleges/${id}`).then((r) => r.json());
      setCollege({ ...updated, courses: updated.courses || [], placements: updated.placements || [], reviews: updated.reviews || [] });
      setReview({ rating: 5, content: "" });
    }
    setSubmitting(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!college) return <div className="min-h-screen flex items-center justify-center text-gray-400">College not found</div>;

  const placement = college.placements?.[0];
  const tabs = ["overview", "courses", "placements", "reviews"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/colleges" className="text-sm text-blue-600 hover:underline mb-4 inline-block">← Back to colleges</Link>
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${college.type === "Public" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>{college.type}</span>
                <span className="text-yellow-500 font-medium">⭐ {college.rating}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{college.name}</h1>
              <p className="text-gray-500 mt-1">📍 {college.location}, {college.state} • Est. {college.established}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={toggleSave} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${saved ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}>
                {saved ? "✓ Saved" : "Save College"}
              </button>
              <Link href={`/compare?colleges=${college.id}`} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-blue-400 transition">
                Compare
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Annual Fees", value: `₹${(college.fees / 100000).toFixed(1)}L` },
              { label: "Avg Package", value: placement ? `${placement.averagePackage} LPA` : "N/A" },
              { label: "Placement Rate", value: placement ? `${placement.placementRate}%` : "N/A" },
              { label: "Reviews", value: college.reviews.length.toString() },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-6 border-t">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-sm font-medium capitalize border-b-2 transition ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-gray-600">{college.description}</p>
            {college.website && (
              <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-4 inline-block hover:underline">Visit Website →</a>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-4">
            {college.courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.duration} years • {course.seats} seats</p>
                </div>
                <p className="font-bold text-gray-800">₹{(course.fees / 100000).toFixed(1)}L/yr</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "placements" && (
          <div className="space-y-4">
            {college.placements.map((p) => (
              <div key={p.year} className="bg-white rounded-xl p-6 shadow-sm grid grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-400">Year</p><p className="text-xl font-bold">{p.year}</p></div>
                <div><p className="text-xs text-gray-400">Avg Package</p><p className="text-xl font-bold">{p.averagePackage} LPA</p></div>
                <div><p className="text-xs text-gray-400">Highest Package</p><p className="text-xl font-bold">{p.highestPackage} LPA</p></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {session && (
              <form onSubmit={submitReview} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold">Write a Review</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Rating:</label>
                  <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} className="border rounded-lg px-3 py-1.5 text-sm">
                    {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
                  </select>
                </div>
                <textarea value={review.content} onChange={(e) => setReview({ ...review, content: e.target.value })} required rows={3} placeholder="Share your experience..." className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
            {college.reviews.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No reviews yet. Be the first!</p>
            ) : (
              college.reviews.map((r) => (
                <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">{r.user.name}</span>
                    <span className="text-yellow-500">{"⭐".repeat(r.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{r.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
