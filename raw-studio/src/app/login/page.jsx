"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import Button from "@/components/Button";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Animation d'entrée des éléments du formulaire
  useEffect(() => {
    const inputField = document.querySelector("[data-login-input]");
    const background = document.querySelector("[data-login-background]");
    const submitBtn = document.querySelector("[data-login-submit]");
    
    gsap.fromTo(
      [background, inputField, submitBtn],
      {
        // opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, []);

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
      <div className="w-full flex flex-col  items-center justify-center">
        {/* Header */}
       
        {/* Form */}
        <div className="overflow-hidden">
        <form               data-login-background
onSubmit={handleSubmit} className="flex h-fit overflow-hidden bg-black w-fit p-1 ">
         
          
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-white px-3 "
              disabled={loading}
              data-login-input
            />
         

        

          <Button
            type="submit"
            disabled={loading}
            variant="secondary"
            data-login-submit
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
          
        </form>
        </div>
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
