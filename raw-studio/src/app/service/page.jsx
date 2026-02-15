"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

export default function ServicePage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
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
            <span className="text-sm text-gray-600">Service Access</span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Service Dashboard</h1>
            <p className="text-gray-600">
              View all projects and their details. Service users cannot edit or delete projects.
            </p>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => {
                // Parse images
                const projectImages = typeof project.images === 'string' 
                  ? JSON.parse(project.images) 
                  : (Array.isArray(project.images) ? project.images : []);

                // Parse technologies
                const projectTechs = typeof project.technologies === 'string'
                  ? JSON.parse(project.technologies)
                  : (Array.isArray(project.technologies) ? project.technologies : []);

                return (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex gap-6">
                      {/* Thumbnail */}
                      {projectImages.length > 0 && (
                        <div className="shrink-0 w-40">
                          <img
                            src={projectImages[0]}
                            alt={project.title}
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="grow">
                        <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                        <p className="text-gray-600 text-sm mb-3">
                          {project.shortDesc}
                        </p>

                        {/* Technologies */}
                        {projectTechs.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {projectTechs.map((tech, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Details →
                          </Link>
                          {project.externalLink && (
                            <a
                              href={project.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Visit Project →
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="shrink-0 text-right text-sm text-gray-500">
                        <p>Featured: {project.featured ? "Yes" : "No"}</p>
                        <p>
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
