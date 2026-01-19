"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-0">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            Creative Digital Work
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Handcrafted digital experiences that blend design, innovation, and craftsmanship
          </p>
        </div>
      </section>

      {/* Galerie Dynamique */}
      <section className="px-6 md:px-0 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-16">Recent Works</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => {
                // Parse images si c'est une string JSON
                const projectImages = typeof project.images === 'string' 
                  ? JSON.parse(project.images) 
                  : (Array.isArray(project.images) ? project.images : []);
                
                return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {/* Image du projet */}
                    {projectImages && projectImages.length > 0 ? (
                      <img
                        src={projectImages[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition font-medium">
                        View Project →
                      </span>
                    </div>
                  </div>

                  {/* Info du projet */}
                  <div>
                    <h3 className="text-lg font-bold group-hover:opacity-60 transition">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{project.shortDesc}</p>

                    {/* Technologies */}
                    {project.technologies && (
                      (() => {
                        const techs = typeof project.technologies === 'string' 
                          ? JSON.parse(project.technologies) 
                          : project.technologies;
                        return techs && techs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {techs.slice(0, 2).map((tech, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6 md:px-0">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          <p>&copy; 2026 Raw Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
