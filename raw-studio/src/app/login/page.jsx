"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Rediriger selon le rôle
        if (data.role === "ADMIN") {
          router.push("/admin");
        } else if (data.role === "SERVICE") {
          router.push("/service");
        } else {
          router.push("/");
        }
      } else {
        setError("Invalid password. Try: admin123 or service123");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
            <Navbar />
      
      <div className="w-full flex flex-col  items-center justify-center">
        {/* Header */}
       
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex h-fit bg-black w-fit p-1 ">
         
          
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-white px-3 "
              disabled={loading}
            />
         

        

          <button
            type="submit"
            disabled={loading}
            className="w-fit  py-2 px-3 bg-white text-black  font-medium  hover:bg-gray-900 disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
          
        </form>
  {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        {/* Demo Info */}
        {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p>Password: <code className="bg-white px-2 py-1 rounded font-mono">admin123</code></p>
        </div> */}
      </div>
    </div>
  );
}
