"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import ToggleSwitch from "@/components/ToggleSwitch";
import Checkbox from "@/components/Checkbox";
import StatusTag from "@/components/StatusTag";
import { Sidebar } from "@/components/Sidebar";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();

  // Gérer le tri
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Appliquer le tri
  const getSortedProjects = () => {
    if (!sortBy) return projects;

    const sorted = [...projects];
    sorted.sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "name") {
        aValue = (a.title || "").toLowerCase();
        bValue = (b.title || "").toLowerCase();
      } else if (sortBy === "type") {
        aValue = (a.technologies || "").toLowerCase();
        bValue = (b.technologies || "").toLowerCase();
      } else if (sortBy === "client") {
        aValue = (a.client || "").toLowerCase();
        bValue = (b.client || "").toLowerCase();
      } else if (sortBy === "date") {
        aValue = a.projectDate ? new Date(a.projectDate).getTime() : 0;
        bValue = b.projectDate ? new Date(b.projectDate).getTime() : 0;
      } else if (sortBy === "state") {
        aValue = a.isActive ? 1 : 0;
        bValue = b.isActive ? 1 : 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (response.ok) {
        const updated = await response.json();
        setProjects(projects.map((p) => (p.id === id ? updated : p)));
      }
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProjects(projects.filter((p) => p.id !== id));
          setSelectedProjects((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(id);
            return newSelected;
          });
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleSelectProject = (id) => {
    setSelectedProjects((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleToggleSelectedProjects = async () => {
    const projectsToToggle = Array.from(selectedProjects);
    let updatedProjects = [...projects];

    for (const id of projectsToToggle) {
      const project = updatedProjects.find((p) => p.id === id);
      if (project) {
        try {
          const response = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !project.isActive }),
          });
          if (response.ok) {
            const updated = await response.json();
            updatedProjects = updatedProjects.map((p) =>
              p.id === id ? updated : p,
            );
          }
        } catch (error) {
          console.error("Toggle failed:", error);
        }
      }
    }

    setProjects(updatedProjects);
    setSelectedProjects(new Set());
  };

  const handleDeleteSelectedProjects = async () => {
    if (!confirm(`Delete ${selectedProjects.size} selected project(s)?`))
      return;
    const projectsToDelete = Array.from(selectedProjects);
    for (const id of projectsToDelete) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProjects(projects.filter((p) => p.id !== id));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
    setSelectedProjects(new Set());
  };

  return (
    <div className="pl-56  min-h-screen flex bg-white">
      <Sidebar />
      <div className="px-6 py-4">
        <div className=" mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold  uppercase">Project</h1>
              <p className="text-gray-600 text-sm">View your projects</p>
            </div>
            <Button href="/admin/projects/new" size="md">
              + Add a project
            </Button>
          </div>

          {/* Table Header */}
          {!loading && projects.length > 0 && (
            <div className="mb- grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50  text-xs uppercase font-medium text-black/30 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedProjects.size === getSortedProjects().length &&
                    getSortedProjects().length > 0
                  }
                  indeterminate={
                    selectedProjects.size > 0 &&
                    selectedProjects.size < getSortedProjects().length
                  }
                  onChange={() => {
                    if (selectedProjects.size === getSortedProjects().length) {
                      setSelectedProjects(new Set());
                    } else {
                      setSelectedProjects(
                        new Set(getSortedProjects().map((p) => p.id)),
                      );
                    }
                  }}
                />
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-black transition"
                >
                  Name
                  {sortBy === "name" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleSort("type")}
                  className="flex items-center gap-1 hover:text-black transition"
                >
                  Type
                  {sortBy === "type" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleSort("client")}
                  className="flex items-center gap-1 hover:text-black transition"
                >
                  Client
                  {sortBy === "client" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-1 hover:text-black transition"
                >
                  Date
                  {sortBy === "date" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleSort("state")}
                  className="flex items-center gap-1 hover:text-black transition"
                >
                  State
                  {sortBy === "state" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </div>
              {selectedProjects.size > 0 ? (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleToggleSelectedProjects}
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                  >
                    Toggle ({selectedProjects.size})
                  </button>
                  <button
                    onClick={handleDeleteSelectedProjects}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                  >
                    Delete ({selectedProjects.size})
                  </button>
                </div>
              ) : (
                <div className="text-right">Actions</div>
              )}
            </div>
          )}

          {/* Projects List */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <Link
                href="/admin/projects/new"
                className="text-blue-600 hover:underline"
              >
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="text-sm -lg overflow-hidden">
              {getSortedProjects().map((project, index) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") router.push(`/admin/projects/${project.id}`);
                  }}
                  className={`grid grid-cols-6 gap-4 items-center p-4 
                    border-b border-gray-200 transition cursor-pointer ${
                      selectedProjects.has(project.id)
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {/* Image & Name */}
                  <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedProjects.has(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                      />
                    </div>
                    {(() => {
                      try {
                        const images =
                          typeof project.images === "string"
                            ? JSON.parse(project.images)
                            : project.images;
                        const firstImage = Array.isArray(images)
                          ? images[0]
                          : images;
                        return firstImage ? (
                          <div className="relative w-10 h-10 shrink-0">
                            <Image
                              src={firstImage}
                              alt={project.title}
                              fill
                              className=" object-cover"
                            />
                          </div>
                        ) : null;
                      } catch (e) {
                        return null;
                      }
                    })()}
                    <span className="font-medium  truncate">
                      {project.title}
                    </span>
                  </div>

                  {/* Type */}
                  <div>
                    <span className="inline-block uppercase text-xs px-3 py-1 bg-black text-white rounded-full font-medium">
                      {project.technologies
                        ? (() => {
                            try {
                              const techs = JSON.parse(project.technologies);
                              return Array.isArray(techs) && techs.length > 0 ? techs[0] : "—";
                            } catch {
                              return project.technologies || "—";
                            }
                          })()
                        : "—"}
                    </span>
                  </div>

                  {/* Client */}
                  <div className=" text-gray600">{project.client || "—"}</div>

                  {/* Date */}
                  <div className=" text-gray600">
                    {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                  </div>

                  {/* State */}
                  <div>
                    <StatusTag isActive={project.isActive} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4">
                    <div onClick={(e) => e.stopPropagation()}>
                      <ToggleSwitch
                        isActive={project.isActive}
                        onChange={(newStatus) =>
                          handleToggleActive(project.id, !newStatus)
                        }
                      />
                    </div>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-gray-600 hover:text-black transition"
                      title="Edit"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 6.15723L17.1688 1.83398L22 6.66654L8.5 20.1665L2 22.1665L3.66885 15.834L13 6.15723ZM13 6.15723L17.8312 10.9898"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="text-gray-600 hover:text-red-600 transition"
                      title="Delete"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 8.25V22.25H5V8.25M16.5 5.75H22M16.5 5.75L14.4375 1.75H8.875L7.5 5.75M16.5 5.75H7.5M2 5.75H7.5M10 9.75V18.75M14 9.75V18.75"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
