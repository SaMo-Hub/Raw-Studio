"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
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
    setWindowHeight(window.innerHeight);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation GSAP au montage ou quand les projets changent
  useEffect(() => {
    if (!loading && projects.length > 0 && windowHeight > 0) {
      // Créer la timeline GSAP
      const tl = gsap.timeline({
        onComplete: () => {
          setAnimationComplete(true);
        }
      });

      const totalSpacing = (Math.max(leftProjects.length, rightProjects.length) - 1) * 40;

      // Phase 1: Défilement jusqu'au milieu (les colonnes se rapprochent du centre)
      tl.fromTo(".leftproject", {
        y: -(windowHeight * leftProjects.length * 0.7 + (leftProjects.length - 1) * 40 * 0.4),
        scale: 0.4
      }, {
        y: -windowHeight / 2,
        duration: 2,
        ease: "power1.inOut"
      }, 0)
        
        // Phase 2: Scale (0.5s après la fin du défilement)
        .to(".leftproject", {
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power1.inOut"
        }, 2);

        
      tl.fromTo(".rightproject", {
        y: 120,
        scale: 0.4
      }, {
        // y: -windowHeight / 2,
                  y:( -totalHeight + windowHeight)/1.5,

        duration: 2,
        ease: "power1.inOut"
      }, 0)
        
        // Phase 2: Scale (0.5s après la fin du défilement)
        .to(".rightproject", {
          y: -totalHeight + windowHeight,
          scale: 1,
          duration: 0.8,
          ease: "power1.inOut"
        }, 2);
    }
  }, [loading, projects.length, windowHeight]);

  const handleScroll = () => {
    if (animationComplete) {
      setScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (animationComplete) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [animationComplete]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Galerie Dynamique */}
      <section className="">
        <div className="">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 d-lg animate-pulse"
                />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <div ref={sectionsRef} className="grid grid-cols-1 md:grid-cols-2">
              {/* Colonne gauche - scroll vers le haut */}
              <div className="h-full w-full ">
                <div style={{ transform: `translateY(${-scrollY * 0}px)` }} className="leftproject w-full">
                  {projects.filter((_, i) => i % 2 === 0).map((project) => {
                    const projectImages = typeof project.images === 'string' 
                      ? JSON.parse(project.images) 
                      : (Array.isArray(project.images) ? project.images : []);
                    
                    return (
                      <TransitionLink
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer block h-screen bg-amber-800 d-lg overflow-hidden"
                      >
                        <img
                          src={projectImages[0]}
                          alt={project.title}
                          className="w-full h-full object-cover bg-amber-800 group-hover:scale-105 transition duration-300"
                        />
                      </TransitionLink>
                    );
                  })}
                </div>
              </div>

              {/* Colonne droite - scroll vers le bas */}
              <div className="overflow-hidden w-full h-full">
                <div style={{ transform: `translateY(${-totalHeight + windowHeight + scrollY * 2}px)` }} className="rightproject w-full">
                  {projects.filter((_, i) => i % 2 === 1).map((project) => {
                    const projectImages = typeof project.images === 'string' 
                      ? JSON.parse(project.images) 
                      : (Array.isArray(project.images) ? project.images : []);
                    
                    return (
                      <TransitionLink
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer block h-screen bg-amber-800 d-lg overflow-hidden"
                      >
                        <img
                          src={projectImages[0]}
                          alt={project.title}
                          className="w-full h-full  object-cover group-hover:scale-105 transition duration-300"
                        />
                      </TransitionLink>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      {/* <Transition primaryColor="#000000" secondaryColor="#ffffff" /> */}
    </div>
  );
}