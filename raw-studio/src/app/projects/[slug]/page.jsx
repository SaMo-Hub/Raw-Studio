"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";
import { PageAnimationProvider } from "@/context/PageAnimationContext";
import Lenis from "lenis";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper function to split text into words
  const splitIntoWords = (text) => {
    if (!text) return [];
    return text.split(' ');
  };

  const pageRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // ─── Animation de SORTIE ──────────────────────────────────────────────
  const animateOut = (onComplete, destination) => {
    const isNavigatingToRawSport = destination && destination.includes("/raw-sport");
    const tl = gsap.timeline({ onComplete });

    // Animer le titre (miroir)
    const title = document.querySelector("[data-project-title]");
    if (title) {
      tl.to(
        title,
        { y: "100%", opacity: 0, duration: 0.8, ease: "expo.in" },
        0
      );
    }

    // Animer les labels (miroir avec stagger)
    const labels = document.querySelectorAll("[data-project-label]");
    if (labels.length > 0) {
      tl.to(
        labels,
        {
          y: "100%",
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.in",
        },
        0
      );
    }

    // Animer les valeurs (miroir avec stagger)
    const values = document.querySelectorAll("[data-project-value]");
    if (values.length > 0) {
      tl.to(
        values,
        {
          y: "100%",
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.in",
        },
        0
      );
    }

    // Animer les mots du longDesc (miroir avec stagger)
    const words = document.querySelectorAll("[data-project-word]");
    if (words.length > 0) {
      tl.to(
        words,
        {
          y: "100%",
          opacity: 0,
          duration: 0.6,
          stagger: 0.01,
          ease: "expo.in",
        },
        0
      );
    }

    // Animer le bouton Edit (miroir)
    const editButton = document.querySelector("[data-project-edit]");
    if (editButton) {
      tl.to(
        editButton,
        { y: "100%", opacity: 0, duration: 0.8, ease: "expo.in" },
        0
      );
    }

    // Animer le container d'images (miroir)
    const imagesContainer = document.querySelector("[data-project-images]");
    if (imagesContainer) {
      tl.to(
        imagesContainer,
        {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.2,
          ease: "expo.in",
        },
        0
      );
    }

    // Animer l'overlay noir qui monte (seulement si c'est vers raw-sport)
    if (isNavigatingToRawSport) {
      const screenOverlay = document.querySelector("[data-screen-overlay-black]");
      if (screenOverlay) {
        tl.to(screenOverlay, {
          y: "0%",
          duration: 0.8,
          ease: "expo.in",
        }, 0);
      }
    }
  };

  // ─── Animation d'ENTRÉE ──────────────────────────────────────────────
  useEffect(() => {
    if (!project) return;

    const tl = gsap.timeline();

    // Animer le titre
    const title = document.querySelector("[data-project-title]");
    if (title) {
      tl.fromTo(
        title,
        { y: "100%", opacity: 1 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
        0
      );
    }

    // Animer les labels
    const labels = document.querySelectorAll("[data-project-label]");
    if (labels.length > 0) {
      tl.fromTo(
        labels,
        { y: "100%", opacity: 1 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
        },
        0.1
      );
    }

    // Animer les valeurs (client, date, type)
    const values = document.querySelectorAll("[data-project-value]");
    if (values.length > 0) {
      tl.fromTo(
        values,
        { y: "100%", opacity: 1 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "expo.out",
        },
        0.1
      );
    }

    // Animer les mots du longDesc séparément
    const words = document.querySelectorAll("[data-project-word]");
    if (words.length > 0) {
      tl.fromTo(
        words,
        { y: "100%", opacity: 1 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.01,
          ease: "expo.out",
        },
        0.2
      );
    }

    // Animer le bouton Edit
    const editButton = document.querySelector("[data-project-edit]");
    if (editButton) {
      tl.fromTo(
        editButton,
        { y: "100%", opacity: 1 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
        0.4
      );
    }

    // Animer le container d'images
    const imagesContainer = document.querySelector("[data-project-images]");
    if (imagesContainer) {
      tl.to(
        imagesContainer,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "expo.out",
        },
        0
      );
    }
  }, [project]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
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

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.role === "ADMIN");
        }
      } catch (err) {
        console.error("Failed to verify admin status:", err);
      }
    };

    checkAdminStatus();
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    pageRef.current.scrollLeft += e.deltaY * 1.5;
  };

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [project]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el || !project) return;

    const lenis = new Lenis({
      wrapper: el,
      content: el,
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      lerp: 0.08,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [project]);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - pageRef.current.offsetLeft;
    scrollLeft.current = pageRef.current.scrollLeft;
    pageRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - pageRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    pageRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (pageRef.current) pageRef.current.style.cursor = "grab";
  };

  if (loading) {
     return null;

  }

  if (error || !project) {
    return null;

  }

  let parsedImages = [];
  try {
    parsedImages =
      typeof project.images === "string"
        ? JSON.parse(project.images)
        : Array.isArray(project.images)
          ? project.images
          : [];
  } catch {
    parsedImages = [];
  }

  const images = parsedImages || [];

  return (
    <PageAnimationProvider onAnimateOut={animateOut}>
      {/* Overlay noir pour la transition vers raw-sport */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50"
        style={{ transform: "translateY(100%)" }}
        data-screen-overlay-black
      />
      <div
        ref={pageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex h-screen overflow-x-scroll overflow-y-hidden bg-white"
        style={{ cursor: "grab", scrollbarWidth: "none" }}
      >
        <Navbar />

        {/* LEFT COLUMN - Texte */}
        <div data-project-sidebar className=" fixed z-20 shrink-0 h-full text-black bg-white px-6 w-[338px] py-30 flex flex-col justify-start">
          <TransitionLink
            href="/projects"
            className="mb-8 text-xs uppercase tracking-wide text-gray-600 hover:text-black transition"
          >
            ← Back
          </TransitionLink>

          <h1 className="overflow-hidden uppercase font-bold mb-8 leading-tight">
            <span
              data-project-title
              className="block translate-y-[100%]"
            >
              {project.title}
            </span>
          </h1>

          <div className="text-md flex gap-4">
            <div className="uppercase space-y-4 text-gray-500">
              <div className="overflow-hidden">
                <p
                  data-project-label
                  className="translate-y-[100%]"
                >
                  client
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  data-project-label
                  className="translate-y-[100%]"
                >
                  date
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  data-project-label
                  className="translate-y-[100%]"
                >
                  type
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  data-project-label
                  className="translate-y-[100%]"
                >
                  information
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden">
                <p
                  data-project-value
                  className="translate-y-[100%]"
                >
                  {project.client}
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  data-project-value
                  className="translate-y-[100%]"
                >
                  {new Date(project.createdAt).getFullYear()}
                </p>
              </div>
              <div className="overflow-hidden">
                <p
                  data-project-value
                  className="translate-y-[100%]"
                >
                  {project.technologies
                    ? typeof project.technologies === "string"
                      ? (() => {
                          try {
                            return JSON.parse(project.technologies).slice(0, 2).join(", ");
                          } catch {
                            return project.technologies;
                          }
                        })()
                      : project.technologies.slice(0, 2).join(", ")
                    : "N/A"}
                </p>
              </div>
              <div>
                {splitIntoWords(project.longDesc).map((word, idx) => (
                  <span key={idx} className="inline-block overflow-hidden mr-1">
                    <p
                      data-project-word
                      className="translate-y-[100%] inline-block"
                    >
                      {word}
                    </p>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="overflow-hidden">
              <div
                data-project-edit
                className="translate-y-[100%]"
              >
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-xs uppercase tracking-wide text-gray-600 hover:text-black transition inline-block border border-gray-300 px-4 py-2 rounded"
                >
                  Edit
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          data-project-images
          className="flex ml-122 shrink-0 relative"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              className="shrink-0 w-auto relative group transition-all cursor-pointer"
              src={img}
              alt=""
              draggable={false}
            />
          ))}
        </div>

        {/* <Transition primaryColor="#000000" secondaryColor="#ffffff" /> */}
      </div>
    </PageAnimationProvider>
  );
}