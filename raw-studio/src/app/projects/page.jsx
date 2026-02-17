"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";

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
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // grid, horizontal, list
  const horizontalScrollRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects(selectedCategory);
  }, [selectedCategory, projects]);

  // Gestion du scroll horizontal avec souris/touchpad
  useEffect(() => {
    const handleWheel = (e) => {
      if (viewMode === "horizontal") {
        const container = horizontalScrollRef.current;
        if (container) {
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [viewMode]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();

        setProjects(data);
        console.log(data);
        setFilteredProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = (category) => {
    setSelectedCategory(category);
    if (category === "ALL") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => {
          const techs =
            typeof project.technologies === "string"
              ? JSON.parse(project.technologies)
              : project.technologies;
          return techs.some((tech) => tech.toUpperCase() === category);
        }),
      );
    }
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
    if (category === "ALL") {
      return projects.length;
    }
    return projects.filter((project) => {
      const techs =
        typeof project.technologies === "string"
          ? JSON.parse(project.technologies)
          : project.technologies;
      return techs.some((tech) => tech.toUpperCase() === category);
    }).length;
  };

  return (
    <div className=" bg-white pt-24">
          <Navbar />

      <div className="">
        {/* Sidebar Left - Categories */}
        <div className="flex px-12 justify-between">
          <div className="gap-4 flex">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                onClick={() => filterProjects(category)}
                variant={selectedCategory === category ? "primary" : "ghost"}
                size="sm"
              >
                <span>{category}</span>
                <span className="ml-1"> ({getCategoryCount(category)})</span>
              </Button>
            ))}
          </div>

          {/* Divider */}

          <div className="gap-2 flex">
            {VIEW_MODES.map((mode) => (
              <Button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                variant={viewMode === mode.id ? "primary" : "secondary"}
                size="sm"
                className="flex items-center gap-2"
                title={mode.label}
              >
                {mode.icon}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full flex-1 pt-12">
          <div className=" ">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No projects found in this category.
                </p>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="uppercase grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 mb-6">
                    {filteredProjects.map((project) => (
                      <TransitionLink
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden bg-gray-100 aspect-square ">
                          <img
                            src={getProjectImage(project)}
                            alt={project.title}
                            className="w-full  h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <h3 className="mt-2 ml-1 transition">
                          {project.title}
                        </h3>
                      
                      </TransitionLink>
                    ))}
                  </div>
                )}

                {/* Horizontal View */}
                {viewMode === "horizontal" && (
                  <div ref={horizontalScrollRef} className="uppercase flex w-screen overflow-hidden">
                    {filteredProjects.map((project) => (
                      <TransitionLink
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group h-full cursor-pointer flex flex-col shrink-0"
                      >
                        <div className="relative flex flex-col">
                          <img
                            src={getProjectImage(project)}
                            alt={project.title}
                            className="h-[73vh] w-96 object-cover group-hover:scale-105 transition duration-300"
                          />
                          <h3 className="mt-2 ml-1 text-black transition">
                            {project.title}
                          </h3>
                        </div>
                      </TransitionLink>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
  <div className="w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 uppercase px-12">
                    {/* Image centrale fixe */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-140 h-140  overflow-hidden pointer-events-none z-10">
                      {filteredProjects.map((project, index) => (
                        <img
                          key={project.id}
                          id={`project-image-${index}`}
                          className="absolute w-full h-full bg-white object-cover opacity-0 -opacity -300"
                          src={getProjectImage(project)}
                          alt={project.title}
                        />
                      ))}
                    </div>

                    {filteredProjects.map((project, index) => (
                      <TransitionLink
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group uppercase semibold  text-sm bg-white py-6 cursor-pointer flex gap-24 items-center  "
                        onMouseEnter={() => {
                          // Masquer toutes les images
                          filteredProjects.forEach((_, i) => {
                            const img = document.getElementById(
                              `project-image-${i}`,
                            );
                            if (img) img.style.opacity = "0";
                          });
                          // Afficher l'image du projet survolé
                          const currentImg = document.getElementById(
                            `project-image-${index}`,
                          );
                          if (currentImg) currentImg.style.opacity = "1";
                        }}
                        onMouseLeave={() => {
                          // Masquer l'image au départ de la souris
                          const currentImg = document.getElementById(
                            `project-image-${index}`,
                          );
                          if (currentImg) currentImg.style.opacity = "0";
                        }}
                      >
                         <div className="relative py-2 bg-white w-1/5 -ml-12">
                          <h3 className="font-neue  ml-12">
                            {"["}
                            {index}
                            {"]"}
                          </h3>
                          <div className=" bg-white -500 mix-blend-difference left-0 scale-x-0 group-hover:scale-x-100 duration-300 ease-in-out transition origin-left  absolute w-3/5 h-full top-0"></div>
                        </div>

                        <h3 className="relative w-2/5">{project.title}</h3>
                        <h3 className="relative text-white z-30 w-2/5 mix-blend-difference">
                          {project.client}
                        </h3>
                        <div className="relative py-2 bg-white w-1/5 justify-end flex -mr-12">
                          <h3 className=" relative mr-12">
                            {project.projectDate
                              ? new Date(project.projectDate).getFullYear()
                              : "N/A"}
                          </h3>
                          <div className=" right-0 scale-x-0 group-hover:scale-x-100 transition duration-300 ease-in-out origin-right bg-white mix-blend-difference absolute w-3/5 h-full top-0"></div>
                        </div>
                      </TransitionLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
         <Transition primaryColor="#000000" secondaryColor="#ffffff" />
      
    </div>
  );
}
