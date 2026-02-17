
 
 
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Vérifier si l'utilisateur est admin
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
  const parsedImages =
    typeof project.images === "string"
      ? JSON.parse(project.images)
      : Array.isArray(project.images)
        ? project.images
        : [];

  const images = parsedImages || [];
  const selectedImage = images[selectedImageIndex] || "";
console.log(images,"gjdfgldfg");

  return (
    <div className=" bg-white">
      {/* Navbar */}
      <Navbar />

        <div className=" flex">
          {/* LEFT COLUMN - Texte */}
          <div className="w-140 fixed left-0 top-0 z-10 text-white mix-blend-difference px-12 py-16 flex flex-col justify-start">
            <Link href="/" className="text-xs uppercase tracking-wide text-gray-600 hover:text-black transition mb-12 block">
              ← Back
            </Link>

            <h1 className="text-2xl font-bold mb-8 leading-tight">
              {project.title}
            </h1>

            

 <div className="text-md flex gap-4">
            <div className="uppercase space-y-4 text-gray-500">
              <p>client</p>
              <p>date</p>
              <p>type</p>
              <p>informaiton</p>
            </div>
            <div className="space-y-4">
              <p>{project.client}</p>
              <p>{new Date(project.createdAt).getFullYear()}</p>
              <p>
                {project.technologies
                  ? typeof project.technologies === "string"
                    ? JSON.parse(project.technologies).slice(0, 2).join(", ")
                    : project.technologies.slice(0, 2).join(", ")
                  : "N/A"}
              </p>
              <p>{project.longDesc} </p>
            </div>
          </div>         

            <div className="flex-1"></div>

            {isAdmin && (
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-xs uppercase tracking-wide text-gray-600 hover:text-black transition inline-block border border-gray-300 px-4 py-2 rounded"
              >
                Edit
              </Link>
            )}
          </div>

         

            {/* Navigation images (bas droite) */}
       
              <div className="ml-140 w-full flex h-screen overflow-hidden">
                {images.map((img, index) => (
                 <img className="h-full w-fit max-w-fit" src={img} alt="" />
                ))}
              </div>
            

            {/* External link (haut droite) */}
           
        </div>
   <Transition primaryColor="#000000" secondaryColor="#ffffff" />
    </div>
  );
}
