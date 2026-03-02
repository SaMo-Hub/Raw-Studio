"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";
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

  const pageRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
    <div
      ref={pageRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="flex h-screen overflow-x-scroll overflow-y-hidden bg-white"
      style={{ cursor: "grab", scrollbarWidth: "none" }}
    >
      {/* <Navbar /> */}

      {/* LEFT COLUMN - Texte */}
      <div className="w-140 fixed z-20 shrink-0 h-full text-white mix-blend-difference px-12 py-16 flex flex-col justify-start">
        <div className="overflow-hidden mb-12 block">
          <motion.div
            initial={{ translateY: "100%" }}
            animate={{ translateY: 0 }}
            transition={{
              delay: 1.1,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Link
              href="/"
              className="text-xs uppercase tracking-wide text-gray-600 hover:text-black transition block"
            >
              ← Back
            </Link>
          </motion.div>
        </div>

        <h1 className=" overflow-hidden uppercase font-bold mb-8 leading-tight">
          <motion.span
            initial={{ translateY: "100%" }}
            animate={{ translateY: 0 }}
            transition={{
              delay: 1.2,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="block"
          >
            {project.title}
          </motion.span>
        </h1>

        <div className="text-md flex gap-4">
          <div className="uppercase space-y-4 text-gray-500">
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.35, duration: 0.8, ease: "easeOut" }}
              >
                client
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.45, duration: 0.8, ease: "easeOut" }}
              >
                date
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.55, duration: 0.8, ease: "easeOut" }}
              >
                type
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.65, duration: 0.8, ease: "easeOut" }}
              >
                information
              </motion.p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.35, duration: 0.8, ease: "easeOut" }}
              >
                {project.client}
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.45, duration: 0.8, ease: "easeOut" }}
              >
                {new Date(project.createdAt).getFullYear()}
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.55, duration: 0.8, ease: "easeOut" }}
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
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.p
                initial={{ translateY: "100%" }}
                animate={{ translateY: 0 }}
                transition={{ delay: 1.65, duration: 0.8, ease: "easeOut" }}
              >
                {project.longDesc}
              </motion.p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="overflow-hidden">
            <motion.div
              initial={{ translateY: "100%" }}
              animate={{ translateY: 0 }}
              transition={{ delay: 1.75, duration: 1.2, ease: [0.9, 0, 0.1, 1] }}
            >
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-xs uppercase tracking-wide text-gray-600 hover:text-black transition inline-block border border-gray-300 px-4 py-2 rounded"
              >
                Edit
              </Link>
            </motion.div>
          </div>
        )}
      </div>

      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.2, ease: [0.9, 0, 0.1, 1] }}

className="flex   ml-140 shrink-0 relative"      >

        {images.map((img, index) => (
          <img
            key={index}
            className="shrink-0  w-auto relative group transition-all cursor-pointer "
            src={img}
            alt=""
            draggable={false}
          />
        ))}
      </motion.div>

      {/* <Transition primaryColor="#000000" secondaryColor="#ffffff" /> */}
    </div>
  );
}