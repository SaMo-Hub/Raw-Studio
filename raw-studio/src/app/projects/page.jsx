"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import Lenis from "lenis";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";
import { PageAnimationProvider } from "@/context/PageAnimationContext";

const CATEGORIES = ["ALL", "COMMERCIAL", "MUSIC VIDEO", "WEB"];

const VIEW_MODES = [
  {
    id: "horizontal",
    label: "Horizontal",
    icon: (
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 8.74224e-08L2 16H0L6.99381e-07 0L2 8.74224e-08Z"
          fill="currentColor"
        />
        <path
          d="M6 8.74224e-08L6 16H4L4 0L6 8.74224e-08Z"
          fill="currentColor"
        />
        <path
          d="M10 8.74224e-08L10 16H8L8 0L10 8.74224e-08Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "grid",
    label: "Grid",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    ),
  },
  {
    id: "list",
    label: "List",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
      </svg>
    ),
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("horizontal");
  const [isAnimatingIn, setIsAnimatingIn] = useState(true);
  const horizontalScrollRef = useRef(null);
  const lenisRef = useRef(null);
  const viewModeRef = useRef(viewMode);
  
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects(selectedCategory);
  }, [selectedCategory, projects]);

  // Scroll horizontal fluide avec Lenis
  useEffect(() => {
    const container = horizontalScrollRef.current;
    if (!container || viewMode !== "horizontal") return;

    // Créer instance Lenis pour scroll horizontal fluide
    const lenis = new Lenis({
      wrapper: container,
      content: container,
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      lerp: 0.08,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [viewMode, filteredProjects]);

  // Animation d'entrée boutons de filtre / vue
  useEffect(() => {
    if (!loading) {
      const filterButtons = document.querySelectorAll("[data-filter-button]");
      const viewModeButtons = document.querySelectorAll("[data-view-mode-button]");

      if (filterButtons.length > 0) {
        gsap.fromTo(
          filterButtons,
          { y: 90 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
        );
      }
      if (viewModeButtons.length > 0) {
        gsap.fromTo(
          viewModeButtons,
          { y: 90 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
        );
      }
    }
  }, [loading]);

  // ─── Animation d'ENTRÉE unifiée (grid + horizontal + list) ───────────────────
  useEffect(() => {
    if (!loading) {
      const currentMode = viewModeRef.current;
      setIsAnimatingIn(true);

      if (currentMode === "horizontal" || currentMode === "grid") {
        // Items image
        const items = document.querySelectorAll("[data-horizontal-item]");
        const texts = document.querySelectorAll("[data-horizontal-text]");

        if (items.length > 0) {
          gsap.set(items, { y: "140%", rotateX: 12 });
          gsap.to(items, {
            y: 0,
            rotateX: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            stagger: { each: 0.02, ease: "power2.out" },
            ease: "expo.out",
            clearProps: "transform,opacity",
          });
        }
        if (texts && texts.length > 0) {
          gsap.set(texts, { y: "100%", opacity: 0, clipPath: "inset(0 0 100% 0)" });
          gsap.to(texts, {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            stagger: { each: 0.07, from: "start" },
            ease: "expo.out",
            delay: 0.1,
            clearProps: "transform,opacity,clipPath",
          });
        }
      }

      if (currentMode === "list") {
        const rows = document.querySelectorAll("[data-list-row]");
        if (rows.length > 0) {
          gsap.set(rows, { y: "60px", opacity: 0, clipPath: "inset(0 0 100% 0)" });
          gsap.to(rows, {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.7,
            stagger: { each: 0.05, from: "start" },
            ease: "expo.out",
            clearProps: "transform,opacity,clipPath",
          });
        }
      }

      // Désactiver le flag d'animation après 2 secondes (durée max + stagger)
      const timeout = setTimeout(() => {
        setIsAnimatingIn(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [viewMode, filteredProjects, loading]);

  // Désactiver le scroll pendant l'animation d'entrée
  useEffect(() => {
    if (isAnimatingIn) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
  }, [isAnimatingIn]);

  // ─── Animation de SORTIE unifiée ──────────────────────────────────────────────
  /**
   * Joue l'animation de sortie pour le mode courant, puis appelle onComplete.
   */

  const animateOut = (onComplete, destination) => {
    const currentMode = viewModeRef.current;
    const isNavigatingToRawSport = destination && destination.includes("/raw-sport");

    if (currentMode === "horizontal" || currentMode === "grid") {
      const items = document.querySelectorAll("[data-horizontal-item]");
      const texts = document.querySelectorAll("[data-horizontal-text]");

      const tl = gsap.timeline({ onComplete });

      // Animer l'overlay noir qui monte (seulement si c'est vers raw-sport)
     
      if (texts.length > 0) {
        tl.to(texts, {
          y: "-100%",
          clipPath: "inset(0 0 0% 100%)",
          opacity: 0,
          duration: 0.45,
          stagger: { each: 0.03, from: "start" },
          ease: "expo.in",
        });
      }
      if (items.length > 0) {
        tl.to(
          items,
          {
            y: "-120%",
            rotateX: -10,
            duration: 0.55,
            stagger: { each: 0.05, ease: "power2.in" },
            ease: "expo.in",
          },
          "<0.05"
        );
      }
       if(isNavigatingToRawSport) {
        const screenOverlay = document.querySelector("[data-screen-overlay-black]");
        if (screenOverlay) {
          tl.to(screenOverlay, {
            y: "0%",
            duration: 0.8,
            ease: "expo.in",
          
          }, 0);
        }
      }

      // Fallback si vue vide
      if (items.length === 0 && texts.length === 0) onComplete();
    }

    if (currentMode === "list") {
      const rows = document.querySelectorAll("[data-list-row]");
      const imageContainer = document.querySelector("[data-projects-image-container]");
      
      const tl = gsap.timeline({ onComplete });

      // Animer l'overlay noir qui monte (seulement si c'est vers raw-sport)
      if(isNavigatingToRawSport) {
        const screenOverlay = document.querySelector("[data-screen-overlay-black]");
        if (screenOverlay) {
          tl.to(screenOverlay, {
            y: "-100%",
            duration: 0.8,
            ease: "expo.in",
          }, 0);
        }
      }
      
      if (rows.length > 0) {
        tl.to(rows, {
          y: "-60px",
          // opacity: 0,
          // clipPath: "inset(100% 0 0% 0)",
          duration: 0.5,
          stagger: { each: 0.04, from: "start" },
          ease: "expo.in",
        });
      }
      
      // Clear the image container after rows animation finishes
      if (imageContainer) {
        tl.to(imageContainer, {
          opacity: 0,
          duration: 0.6,
          ease: "expo.in",
        });
      }
      
      if (rows.length === 0 && !imageContainer) {
        onComplete();
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFiltered = (category) => {
    if (category === "ALL") return projects;
    return projects.filter((project) => {
      try {
        const techs =
          typeof project.technologies === "string"
            ? JSON.parse(project.technologies)
            : project.technologies;
        if (Array.isArray(techs)) {
          return techs.some((tech) => tech.toUpperCase() === category);
        }
        return false;
      } catch {
        // Handle plain string format (legacy data)
        return project.technologies?.toUpperCase?.() === category;
      }
    });
  };

  const filterProjects = (category) => {
    setSelectedCategory(category);
    animateOut(() => setFilteredProjects(getFiltered(category)));
  };

  // ─── Changement de vue avec animation de sortie ───────────────────────────────
  const changeViewMode = (newMode) => {
    if (newMode === viewMode) return;
    animateOut(() => setViewMode(newMode));
  };

  // ─── Navigation vers un projet avec animation de sortie ───────────────────────
  const handleNavigateToProject = (slug) => {
    animateOut(() => router.push(`/projects/${slug}`));
  };

  const getProjectImage = (project) => {
    try {
      const images =
        typeof project.images === "string"
          ? JSON.parse(project.images)
          : project.images;
      return Array.isArray(images) ? images[0] : "/placeholder.jpg";
    } catch {
      return "/placeholder.jpg";
    }
  };

  const getCategoryCount = (category) => {
    if (category === "ALL") return projects.length;
    return projects.filter((project) => {
      try {
        const techs =
          typeof project.technologies === "string"
            ? JSON.parse(project.technologies)
            : project.technologies;
        if (Array.isArray(techs)) {
          return techs.some((tech) => tech.toUpperCase() === category);
        }
        return false;
      } catch {
        // Handle plain string format (legacy data)
        return project.technologies?.toUpperCase?.() === category;
      }
    }).length;
  };

  return (
    <PageAnimationProvider onAnimateOut={animateOut}>
      <div className="bg-white pt-24 no-scrollbar relative">
        {/* Overlay noir pour la transition vers raw-sport */}
        <div 
          className="fixed inset-0 bg-black pointer-events-none z-50"
          style={{ transform: "translateY(100%)" }}
          data-screen-overlay-black
        />
        
        <Navbar />

        <div className="">
        {/* Sidebar Left - Categories */}
        <div className="flex px-6 justify-between">
          <div className="gap-2 flex overflow-hidden">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                data-filter-button
                onClick={() => filterProjects(category)}
                variant={selectedCategory === category ? "primary" : "ghost"}
                size="sm"
                className="flex translate-y-22.5"
              >
                <span>{category}</span>
                <span className="ml-1">({getCategoryCount(category)})</span>
              </Button>
            ))}
          </div>

          <div className="gap-2 flex overflow-hidden">
            
            {VIEW_MODES.map((mode) => (
              <Button
                key={mode.id}
                data-view-mode-button
                onClick={() => changeViewMode(mode.id)}
                variant={viewMode === mode.id ? "primary" : "secondary"}
                size="sm"
                className="flex translate-y-22.5  items-center gap-2"
                title={mode.label}
              >
                {mode.icon}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full flex-1 pt-12">
          <div className="">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600"></p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No projects found in this category.</p>
              </div>
            ) : (
              <>
                {/* ── Grid View ── */}
                {viewMode === "grid" && (
                  <div className="uppercase no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 mb-6">
                    {filteredProjects.map((project) => (
                      <Link
                        data-grid-item
                        key={project.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigateToProject(project.slug);
                        }}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden aspect-square">
                          <img
                            data-horizontal-item
                            src={getProjectImage(project)}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105"
                          />
                        </div>
                        <div className="relative overflow-hidden">
                          <h3
                            data-horizontal-text
                            className="mt-2 ml-1 transition"
                          >
                            {project.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ── Horizontal View ── */}
                {viewMode === "horizontal" && (
                  <div
                    ref={horizontalScrollRef}
                    className="uppercase flex w-screen overflow-hidden no-scrollbar"
                  >
                    {filteredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigateToProject(project.slug);
                        }}
                        className="group h-full cursor-pointer flex flex-col shrink-0"
                      >
                        <div className="relative flex flex-col">
                          <div className="h-[73vh] overflow-hidden w-96">
                            <img
                              data-horizontal-item
                              src={getProjectImage(project)}
                              alt={project.title}
                              className="h-full  w-full object-cover group-hover:scale-105"
                            />
                          </div>
                          <div className="relative overflow-hidden">
                            <h3
                              data-horizontal-text
                              className="mt-2 ml-1 text-black"
                            >
                              {project.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ── List View ── */}
                {viewMode === "list" && (
                  <div className="w-full overflo-hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 uppercase px-12">
                    {/* Image centrale fixe */}
                    <div data-projects-image-container className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-140 overflow-hidden pointer-events-none z-10">
                      {filteredProjects.map((project, index) => (
                        <img
                          key={project.id}
                          id={`project-image-${index}`}
                          className="absolute w-full h-full bg-white object-cover opacity-0 transition-opacity duration-300"
                          src={getProjectImage(project)}
                          alt={project.title}
                        />
                      ))}
                    </div>

                    {filteredProjects.map((project, index) => (
                      <div
                        key={project.id}
                        className="group uppercase overflow-hidden "
                        onMouseEnter={() => {
                          filteredProjects.forEach((_, i) => {
                            const img = document.getElementById(`project-image-${i}`);
                            if (img) img.style.opacity = "0";
                          });
                          const currentImg = document.getElementById(`project-image-${index}`);
                          if (currentImg) currentImg.style.opacity = "1";
                        }}
                        onMouseLeave={() => {
                          const currentImg = document.getElementById(`project-image-${index}`);
                          if (currentImg) currentImg.style.opacity = "0";
                        }}
                      >
                        <Link
                          data-list-row
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigateToProject(project.slug);
                          }}
                          className="cursor-pointer py-4 flex gap-24 bg-white items-center">
                          <div className="relative py-2 bg-white w-1/5 -ml-12">
                            <h3 className="font-neue ml-12">
                              [{index}]
                            </h3>
                            <div className="bg-white mix-blend-difference left-0 scale-x-0 group-hover:scale-x-100 duration-300 ease-in-out transition origin-left absolute w-3/5 h-full top-0" />
                          </div>

                          <h3 className="relative z-20 text-white mix-blend-difference w-2/5">{project.title}</h3>
                          <h3 className="relative text-white z-30 w-2/5 mix-blend-difference">
                            {project.client}
                          </h3>

                          <div className="relative py-2 bg-white w-1/5 justify-end flex -mr-12">
                            <h3 className="relative mr-12">
                              {project.projectDate
                                ? new Date(project.projectDate).getFullYear()
                                : "N/A"}
                            </h3>
                            <div className="right-0 scale-x-0 group-hover:scale-x-100 transition duration-300 ease-in-out origin-right bg-white mix-blend-difference absolute w-3/5 h-full top-0" />
                          </div>
                        </Link>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </PageAnimationProvider>
  );
}