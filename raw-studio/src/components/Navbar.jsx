"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (cookie présent)
    const hasCookie = document.cookie.includes("auth_token");
    setIsLoggedIn(hasCookie);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          RAW STUDIO
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:opacity-60 transition">
            Portfolio
          </Link>
          <Link href="#about" className="text-sm font-medium hover:opacity-60 transition">
            About
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/admin" className="text-sm font-medium hover:opacity-60 transition">
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:opacity-60 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium hover:opacity-60 transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
