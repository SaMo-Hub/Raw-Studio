"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (response.ok) {
          setProjects(projects.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            RAW STUDIO
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-medium">
              Admin
            </Link>
            <form
              action={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/");
              }}
            >
              <button type="submit" className="text-sm font-medium hover:opacity-60">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your portfolio projects</p>
            </div>
            <Link
              href="/admin/projects/new"
              className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition"
            >
              + New Project
            </Link>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <Link
                href="/admin/projects/new"
                className="text-blue-600 hover:underline"
              >
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <h3 className="font-medium text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.shortDesc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
