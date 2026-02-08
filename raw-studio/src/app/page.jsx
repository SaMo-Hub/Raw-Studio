"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const sectionsRef = useRef(null);

  // Calculer la hauteur totale du contenu (nombre de projets * hauteur d'écran)
  const leftProjects = projects.filter((_, i) => i % 2 === 0);
  const rightProjects = projects.filter((_, i) => i % 2 === 1);
  const totalHeight = Math.max(leftProjects.length, rightProjects.length) * windowHeight;
  
  // Boucler le scroll pour créer un effet infini
  const loopedScrollY = totalHeight > 0 ? scrollY % totalHeight : scrollY;

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    setWindowHeight(window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">

{/* <div className="w-full  flex">
  <div className="bg-yellow-800 w-full h-screen ">
  </div>
  <div className="bg-blue-800 w-full h-screen ">
  </div>
</div> */}
      {/* Hero Section */}
   

      {/* Galerie Dynamique */}
      <section className="">
        <div className="">

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-screen overflow-hidden">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <div ref={sectionsRef} className="grid min-h-screen grid-cols-1 md:grid-cols-2">
              {/* Colonne gauche - scroll vers le haut */}
              <div className="overflow-hidden w-full min-h-screen">
                <div style={{ transform: `translateY(${-scrollY * 0}px)` }} className="w-full">
                  {projects.filter((_, i) => i % 2 === 0).slice(0, 2).map((project) => {
                    const projectImages = typeof project.images === 'string' 
                      ? JSON.parse(project.images) 
                      : (Array.isArray(project.images) ? project.images : []);
                    
                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer block h-screen bg-amber-800 rounded-lg overflow-hidden"
                      >
                        <img
                          src={projectImages[0]}
                          alt={project.title}
                          className="w-full h-full object-cover bg-amber-800 group-hover:scale-105 transition duration-300"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Colonne droite - scroll vers le bas */}
              <div className="overflow-hidden w-full min-h-screen">
                <div style={{ transform: `translateY(${-windowHeight + scrollY * 2}px)` }} className="w-full">
                  {projects.filter((_, i) => i % 2 === 1).slice(0, 2).map((project) => {
                    const projectImages = typeof project.images === 'string' 
                      ? JSON.parse(project.images) 
                      : (Array.isArray(project.images) ? project.images : []);
                    
                    return (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer block h-screen bg-amber-800 rounded-lg overflow-hidden"
                      >
                        <img
                          src={projectImages[0]}
                          alt={project.title}
                          className="w-full h-full  object-cover group-hover:scale-105 transition duration-300"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    

      {/* Footer */}
    
    </div>
  );
}
