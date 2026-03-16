"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/TransitionLink";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const sectionsRef = useRef(null);
  const router = useRouter();

  const leftProjects = projects.filter((_, i) => i % 2 === 0);
  const rightProjects = projects.filter((_, i) => i % 2 === 1);
  const totalHeight = Math.max(leftProjects.length, rightProjects.length) * windowHeight;

  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasSeenAnimation = sessionStorage.getItem("hasSeenDramaticAnimation");
    if (hasSeenAnimation) {
      setIsFirstVisit(false);
    } else {
      sessionStorage.setItem("hasSeenDramaticAnimation", "true");
    }

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

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation d'entrée
  useEffect(() => {
    if (!loading && projects.length > 0 && windowHeight > 0) {
      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true),
      });

      if (isFirstVisit) {
        // Animation dramatique pour la première visite
        tl.fromTo(
          ".leftproject",
          {
            y: -(windowHeight * leftProjects.length * 0.7 + (leftProjects.length - 1) * 40 * 0.4),
            scale: 0.38,
          },
          { y: -windowHeight / 2, opacity: 1, duration: 2.4, ease: "expo.inOut" },
          0
        ).to(".leftproject", { y: 0, scale: 1, duration: 1.2, ease: "expo.out" }, 2.4);

        tl.fromTo(
          ".rightproject",
          { y: 160, scale: 0.38 },
          {
            y: (-totalHeight + windowHeight) / 1.5,
            opacity: 1,
            duration: 2.4,
            ease: "expo.inOut",
          },
          0
        ).to(
          ".rightproject",
          { y: -totalHeight + windowHeight, scale: 1, duration: 1.2, ease: "expo.out" },
          2.4
        );
      } else {
        // Animation plus chill pour la navigation
        tl.fromTo(
          ".leftproject",
          { clipPath: "inset(0% 0% 100% 0%)", },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 3, delay: 0.5, ease: [0.9, 0, 0.1, 1] },
          0
        );

        tl.fromTo(
          ".rightproject",
          { clipPath: "inset(100% 0% 0% 0%)", },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 3, delay: 0.5, ease: "power2.out" },
          0
        );
      }
    }
  }, [loading, projects.length, windowHeight, isFirstVisit, leftProjects.length, totalHeight]);

  useEffect(() => {
    if (!animationComplete) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animationComplete]);

  // ── Animation de sortie cinématique ──────────────────────────────────────
  const animateOut = (onComplete) => {
    const tl = gsap.timeline({ onComplete });

    // Animer la colonne gauche
    tl.to(
      ".leftproject",
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.2,
        ease: "expo.in",
      },
      0
    );

    // Animer la colonne droite
    tl.to(
      ".rightproject",
      {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.2,
        ease: "expo.in",
      },
      0
    );

    // Animer la navbar
    const navbar = document.querySelector("nav");
    if (navbar) {
      tl.to(
        navbar,
        {
          y: "-100%",
          opacity: 0,
          duration: 0.8,
          ease: "expo.in",
        },
        0
      );
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section>
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-100 d-lg animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects yet. Check back soon!</p>
            </div>
          ) : (
            <div ref={sectionsRef} className="grid grid-cols-1 md:grid-cols-2">
              {/* Colonne gauche */}
              <div className="h-full w-full">
                <div
                  style={{ transform: `translateY(${-scrollY * 0}px)` }}
                  className="leftproject w-full"
                >
                  {projects
                    .filter((_, i) => i % 2 === 0)
                    .map((project) => {
                      const projectImages =
                        typeof project.images === "string"
                          ? JSON.parse(project.images)
                          : Array.isArray(project.images)
                            ? project.images
                            : [];

                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            animateOut(() => {
                              router.push(`/projects/${project.slug}`);
                            });
                          }}
                          className="group cursor-pointer block h-screen bg-amber-800 d-lg overflow-hidden"
                        >
                          <img
                            src={projectImages[0]}
                            alt={project.title}
                            className="w-full h-full object-cover bg-amber-800 group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Colonne droite */}
              <div className="overflow-hidden w-full h-full">
                <div
                  style={{
                    transform: `translateY(${-totalHeight + windowHeight + scrollY * 2}px)`,
                  }}
                  className="rightproject w-full"
                >
                  {projects
                    .filter((_, i) => i % 2 === 1)
                    .map((project) => {
                      const projectImages =
                        typeof project.images === "string"
                          ? JSON.parse(project.images)
                          : Array.isArray(project.images)
                            ? project.images
                            : [];

                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            animateOut(() => {
                              router.push(`/projects/${project.slug}`);
                            });
                          }}
                          className="group cursor-pointer block h-screen bg-amber-800 d-lg overflow-hidden"
                        >
                          <img
                            src={projectImages[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}