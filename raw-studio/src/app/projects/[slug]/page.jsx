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

  const parsedImages =
    typeof project.images === "string"
      ? JSON.parse(project.images)
      : Array.isArray(project.images)
        ? project.images
        : [];

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
      <Navbar />

      {/* LEFT COLUMN - Texte */}
      <div className="w-140 fixed shrink-0 h-full text-white mix-blend-difference px-12 py-16 flex flex-col justify-start">
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

        <h1 className="text-2xl overflow-hidden uppercase font-bold mb-8 leading-tight">
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
                    ? JSON.parse(project.technologies).slice(0, 2).join(", ")
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
        initial={{ translateX: 600 }}
        animate={{ translateX: 0 }}
        transition={{
          delay: 1.5,
          duration: 0.6,
          ease: "easeOut",
        }}
        className="flex ml-140"
      >
        {images.map((img, index) => (
          <img
            key={index}
            className="h-full bg-amber-700 shrink-0 object-cover"
            style={{
              width: "100vw",
              backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
            }}
            src={img}
            alt=""
            draggable={false}
          />
        ))}
      </motion.div>

      <Transition primaryColor="#000000" secondaryColor="#ffffff" />
    </div>
  );
}