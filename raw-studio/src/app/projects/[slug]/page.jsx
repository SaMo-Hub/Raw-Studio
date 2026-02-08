"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Récupérer tous les projets et trouver celui avec le slug
        const response = await fetch("/api/projects");
        if (response.ok) {
          const projects = await response.json();
          const foundProject = projects.find((p) => p.slug === slug);
          if (foundProject) {
            setProject(foundProject);
          } else {
            setError("Project not found");
          }
        } else {
          setError("Failed to load project");
        }
      } catch (err) {
        setError("An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
      
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white">
       
        <div className="pt-20 px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Link href="/" className="text-blue-600 hover:underline text-sm">
                ← Back to Portfolio
              </Link>
            </div>
            <p className="text-gray-600">{error || "Project not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  // Parse images si c'est une string JSON
  const parsedImages = typeof project.images === 'string' 
    ? JSON.parse(project.images) 
    : (Array.isArray(project.images) ? project.images : []);
  
  const images = parsedImages || [];
  const selectedImage = images[selectedImageIndex] || "";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
   

      <div className="pt-20 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <div className="mb-8">
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              ← Back to Portfolio
            </Link>
          </div>

          {/* Titre du projet */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600">{project.shortDesc}</p>
          </div>

          {/* Galerie d'images */}
          {images.length > 0 && (
            <div className="mb-12">
              {/* Image principale */}
              <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden h-96">
                <img
                  src={selectedImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Miniatures */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-full h-20 rounded overflow-hidden border-2 transition ${
                        selectedImageIndex === index
                          ? "border-black"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contenu principal */}
          <div className="grid grid-cols-3 gap-12 mb-12">
            {/* Description et détails */}
            <div className="col-span-2">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
                {project.longDesc}
              </p>

              {/* Categories */}
              {project.technologies && (
                (() => {
                  const cats = typeof project.technologies === 'string' 
                    ? JSON.parse(project.technologies) 
                    : project.technologies;
                  return cats && cats.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cats.map((cat, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Lien externe */}
              {project.externalLink && (
                <div>
                  <a
                    href={project.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-900 transition font-medium"
                  >
                    Visit Project →
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar d'info */}
            <div className="border-l border-gray-200 pl-8">
              <div className="sticky top-20">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-400">
                  Project Info
                </h3>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                      Type
                    </p>
                    <p className="font-medium">Web Design & Development</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                      Year
                    </p>
                    <p className="font-medium">
                      {new Date(project.createdAt).getFullYear()}
                    </p>
                  </div>

                  {project.technologies && (
                    (() => {
                      const cats = typeof project.technologies === 'string' 
                        ? JSON.parse(project.technologies) 
                        : project.technologies;
                      return cats && cats.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                            Categories
                          </p>
                          <p className="font-medium text-sm">
                            {cats.slice(0, 2).join(", ")}
                          </p>
                        </div>
                      );
                    })()
                  )}

                  {project.externalLink && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                        Link
                      </p>
                      <a
                        href={project.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {new URL(project.externalLink).hostname}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation vers projets */}
          <div className="border-t border-gray-200 pt-12 mt-12">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                ← View All Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
