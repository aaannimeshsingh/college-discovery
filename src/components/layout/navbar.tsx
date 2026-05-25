"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🎓 CollegeDiscover
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/colleges" className="text-sm text-gray-600 hover:text-blue-600 transition">Colleges</Link>
          <Link href="/compare" className="text-sm text-gray-600 hover:text-blue-600 transition">Compare</Link>
          {session && <Link href="/saved" className="text-sm text-gray-600 hover:text-blue-600 transition">Saved</Link>}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden md:block">{session.user?.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border py-1 z-50">
                  <Link href="/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Saved Colleges</Link>
                  <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
