"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier la session via API
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setRole(data.role);
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    setRole(null);
    setShowLogoutModal(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 uppercase right-0 z-50 bg-white/50 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl  tracking-tight">
          RAW STUDIO
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-8">
        
          <Link href="/projects" className="text-xs medium hover:opacity-60 transition">
            Projects
          </Link>
          <Link href="#about" className="text-xs medium hover:opacity-60 transition">
            About
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/admin" className="text-xs medium hover:opacity-60 transition">
                Admin
              </Link>
              
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="text-xs uppercase medium hover:opacity-60 transition"
              >
                Logout
              </button>
               {role === "ADMIN" && (
                <Link
                  href="/admin/service-keys"
                className="text-xs uppercase medium hover:opacity-60 transition"
                >
                 Password
                </Link>
              )}
              {role === "ADMIN" && (
                <Link
                  href="/admin/projects/new"
                  className="text-white bg-black px-2 py-1 text-xs uppercase medium hover:opacity-60 transition "
                >
                  Add Project
                </Link>
              )}
             
            </>
          ) : (
            <Link href="/login" className="text-xs medium hover:opacity-60 transition">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 h-screen w-screen bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            className="bg-white p-8 rounded-lg max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl bold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to disconnect?</p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white medium rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 medium rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>  );
}