"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects(selectedCategory);
  }, [selectedCategory, projects]);

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
      <div className="px-12">
        {/* Sidebar Left - Categories */}
        <div className="flex justify-between">
          <div className="gap-4 flex">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => filterProjects(category)}
                className={` text-left  transition-colors flex justify-between items-center ${
                  selectedCategory === category
                    ? "semibold text-black"
                    : "normal text-gray-500 hover:text-gray-900"
                }`}
              >
                <span>{category}</span>
                <span className=""> ({getCategoryCount(category)})</span>
              </button>
            ))}
          </div>

          {/* Divider */}

          <div className="gap-2 flex">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  viewMode === mode.id
                    ? "bg-black text-white"
                    : "border border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
                title={mode.label}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-12">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden bg-gray-100 aspect-square rounded-lg mb-4">
                          <img
                            src={getProjectImage(project)}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <h3 className="semibold text-lg mb-2 group-hover:text-gray-600 transition">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {project.shortDesc}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Horizontal View */}
                {viewMode === "horizontal" && (
                  <div className="space-y-6">
                    {filteredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group cursor-pointer flex gap-6 pb-6 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="relative overflow-hidden bg-gray-100 w-40 h-40 rounded-lg flex-shrink-0">
                          <img
                            src={getProjectImage(project)}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="flex-1 py-2">
                          <h3 className="semibold text-xl mb-2 group-hover:text-gray-600 transition">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {project.shortDesc}
                          </p>
                          <p className="text-sm text-gray-400">
                            {project.longDesc.substring(0, 100)}...
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className="relative space-y-3">
                    <div></div>
                    {filteredProjects.map((project, index) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group uppercase semibold  text-sm cursor-pointer flex gap-24 items-center  "
                      >
                        <div className="relative w-1/5 -ml-12">
                          <h3 className="font-neue  ml-12">
                            {"["}
                            {index}
                            {"]"}
                          </h3>
                          <div className=" bg-white mix-blend-difference left-0 scale-x-0 group-hover:scale-x-100 transition origin-left  absolute w-3/5 h-full top-0"></div>
                        </div>
                        <div className="absolute translate-x-2/4 2 left-1/2  top-1/2 -translate-y-1/2 w-40 h-40 rounded overflow-hidden">
                          <img className="w-40 h-40 object-cover rounded z-0"  src={getProjectImage(project)}
                            alt={project.title} />
                        </div>
                        <h3 className="relative w-2/5">{project.title}</h3>
                        <h3 className="relative text-white z-30 w-2/5 mix-blend-difference">{project.client}</h3>
                        <div className="relative w-1/5 justify-end flex -mr-12">
                          <h3 className=" relative mr-12">
                            {project.projectDate
                              ? new Date(project.projectDate).getFullYear()
                              : "N/A"}
                          </h3>
                          <div className=" right-0 scale-x-0 group-hover:scale-x-100 transition origin-right bg-white mix-blend-difference absolute w-3/5 h-full top-0"></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
