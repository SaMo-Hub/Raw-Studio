"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data.isLoggedIn && data.role === "ADMIN") {
          setUsername(data.username || "Admzzin");
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen min-w-56 z-10 w-56 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <Link href="/projects" className="text-xl font-bold tracking-tight uppercase">
          <svg
            width="51"
            height="23"
            viewBox="0 0 51 23"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M51 0H45.6115L45.0236 1.83296L41.8437 12.8374L36.9706 1.57665C36.5745 0.618554 35.6296 0 34.5507 0C33.4718 0 32.5387 0.618554 32.1474 1.56625L27.2841 12.8062L24.7146 4.10667C24.0005 1.68826 21.6843 0 19.0815 0H10.3986C8.46087 0.0264824 6.72468 0.450201 5.21835 1.26359V0H0V23H5.21835V11.2371C5.24379 8.44411 6.14954 6.60926 7.98941 5.62563C8.59586 5.29838 9.27273 5.10733 10.0054 5.05625C8.7504 6.94691 8.11559 9.10901 8.11559 11.5019C8.11559 15.0184 9.40086 17.9466 11.9303 20.1995C13.9834 22.058 16.3887 23 19.0893 23C20.9996 22.9801 22.773 22.4987 24.3761 21.5671C24.8016 22.4382 25.7025 23 26.7246 23H26.7579C27.826 23 28.7738 22.3805 29.167 21.4309L34.5566 9.01916L39.9412 21.4205C40.3373 22.3805 41.2832 23.0009 42.3523 23.0009H42.3914C43.5349 23.0009 44.5306 22.2916 44.87 21.2342L50.0923 3.20816L51 0ZM22.8268 16.3955C22.7192 16.4986 22.6067 16.6007 22.4883 16.6991C21.4759 17.5456 20.3609 17.956 19.0815 17.956C17.1946 17.956 15.7128 17.137 14.5547 15.4525C13.7438 14.2665 13.333 12.9376 13.333 11.5019C13.333 9.39843 14.1047 7.69409 15.6922 6.29242C16.3828 5.68048 17.1927 5.28703 18.1004 5.12246C18.1933 5.10544 18.2853 5.09787 18.3772 5.09787C19.0551 5.09787 19.684 5.54618 19.8757 6.20729L22.8268 16.3955Z"
              fill="black"
            />
            <path d="M51 18.864H46.7568V23H51V18.864Z" fill="black" />
          </svg>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <Link
          href="/admin"
          className={` px-4 py-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide transition group ${
            isActive("/admin")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5049 4L12.6611 5.85156L12.9424 6.09277H21V20H3V4H10.5049Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="relative block h-full overflow-hidden">
            <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
              Project
            </span>
            <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
              Project
            </span>
          </span>
        </Link>
        <Link
          href="/admin/service-keys"
          className={` px-4 py-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide transition group ${
            isActive("/admin/service-keys")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.21429 11H12H16.7857M7.21429 11H3V22H21V11H16.7857M7.21429 11H16.7857M7.21429 11V6.78571C7.21429 4.14264 9.35692 2 12 2C14.6431 2 16.7857 4.14264 16.7857 6.78571V11" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="relative block h-full overflow-hidden">
            <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
              Password
            </span>
            <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0 right-0">
              Password
            </span>
          </span>
        </Link>
      </nav>

      {/* Logout & User */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs font-medium text-gray-600 uppercase mb-4 truncate">
          {username}
        </div>
        <Button
          onClick={handleLogout}
          className="w-full"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
