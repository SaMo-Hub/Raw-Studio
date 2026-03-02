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
  const sectionsRef = useRef(null);
  const router = useRouter();

  const leftProjects = projects.filter((_, i) => i % 2 === 0);
  const rightProjects = projects.filter((_, i) => i % 2 === 1);
  const totalHeight = Math.max(leftProjects.length, rightProjects.length) * windowHeight;

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

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation d'entrée premium
  useEffect(() => {
    if (!loading && projects.length > 0 && windowHeight > 0) {
      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true),
      });

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
    }
  }, [loading, projects.length, windowHeight]);

  useEffect(() => {
    if (!animationComplete) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animationComplete]);

  // ── Animation de sortie cinématique ──────────────────────────────────────
  const handleProjectClick = (e, project, imgSrc) => {
    e.preventDefault();
    if (isExiting) return;
    setIsExiting(true);

    const clickedEl = e.currentTarget; // le <a> cliqué
    const imgEl = clickedEl.querySelector("img");

    if (!imgEl) {
      router.push(`/projects/${project.slug}`);
      return;
    }

    // Mesures de l'image cliquée
    const rect = imgEl.getBoundingClientRect();

    // Créer un clone flottant de l'image pour l'animer librement
    const clone = imgEl.cloneNode(true);
    Object.assign(clone.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: 0,
      objectFit: "cover",
      zIndex: 9999,
      pointerEvents: "none",
      willChange: "transform, width, height, top, left",
    });
    document.body.appendChild(clone);

    // Overlay blanc qui recouvre tout le fond
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: 0,
      // background: "#ffffff",
      zIndex: 9998,
      opacity: 0,
      pointerEvents: "none",
    });
    document.body.appendChild(overlay);

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Dimensions naturelles de l'image (ratio natif)
    const naturalW = imgEl.naturalWidth || rect.width;
    const naturalH = imgEl.naturalHeight || rect.height;
    const ratio = naturalW / naturalH;

    // Phase 1 : taille cible centrée — hauteur = 80vh
    const targetH = vh * 0.82;
    const targetW = targetH * ratio;
    const centeredTop = (vh - targetH) / 2;
    const centeredLeft = (vw - targetW) / 2;

    // Phase 2 : position finale (comme sur la page projet — ml-140 ≈ 560px)
    const finalLeft = vw * 0.52; // légèrement à droite du centre

    const tl = gsap.timeline({
      onComplete: () => {
        router.push(`/projects/${project.slug}`);
      },
    });

    // Fade out de tout sauf le clone
    tl.to(
      overlay,
      { opacity: 1, duration: 0.55, ease: "power2.inOut" },
      0
    );

    // Fondu des colonnes
    tl.to(
      [".leftproject", ".rightproject"],
      { opacity: 0, duration: 0.4, ease: "power2.in" },
      0
    );

    // Phase 1 : l'image se centre et prend ses proportions naturelles
    tl.to(
      clone,
      {
        top: centeredTop,
        left: centeredLeft,
        width: targetW,
        height: targetH,
        duration: 0.85,
        ease: "expo.inOut",
      },
      0.1
    );

    // Phase 2 : glisse vers la droite (position page projet)
    tl.to(
      clone,
      {
        left: finalLeft,
        duration: 0.7,
        ease: "expo.inOut",
      },
      0.85
    );
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}

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
                        <a
                          key={project.id}
                          href={`/projects/${project.slug}`}
                          onClick={(e) => handleProjectClick(e, project, projectImages[0])}
                          className="group cursor-pointer block h-screen bg-amber-800 d-lg overflow-hidden"
                        >
                          <img
                            src={projectImages[0]}
                            alt={project.title}
                            className="w-full h-full object-cover bg-amber-800 group-hover:scale-105 transition duration-300"
                          />
                        </a>
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
                        <a
                          key={project.id}
                          href={`/projects/${project.slug}`}
                          onClick={(e) => handleProjectClick(e, project, projectImages[0])}
                          className="group cursor-pointer block h-screen bg-amber-800 d-lg overflow-hidden"
                        >
                          <img
                            src={projectImages[0]}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </a>
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