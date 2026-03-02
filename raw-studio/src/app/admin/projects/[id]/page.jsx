"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import OptionSelector from "@/components/OptionSelector";
import Navbar from "@/components/Navbar";
import { Transition } from "@/components/Transition";
import { TransitionLink } from "@/components/TransitionLink";

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    longDesc: "",
    categories: "",
    externalLink: "",
    featured: false,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedImagePosition, setSelectedImagePosition] = useState(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderItemIndex, setReorderItemIndex] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const pageRef = useRef(null);
  const fileInputRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const textareaRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const targetScrollLeft = useRef(0);
  const animating = useRef(false);

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) {
          setError("Project ID not found");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/projects/${id}`, {
          cache: "no-store",
          priority: "high",
        });

        if (response.ok) {
          const project = await response.json();

          let cats = "";
          if (project.technologies) {
            try {
              const parsedTechs =
                typeof project.technologies === "string"
                  ? JSON.parse(project.technologies)
                  : project.technologies;
              cats = Array.isArray(parsedTechs) && parsedTechs.length > 0 ? parsedTechs[0] : "";
            } catch (e) {
              // Si le parse échoue, traiter comme une string simple
              cats = typeof project.technologies === "string" ? project.technologies : "";
            }
          }

          let imgs = [];
          if (project.images) {
            try {
              imgs =
                typeof project.images === "string"
                  ? JSON.parse(project.images)
                  : Array.isArray(project.images)
                    ? project.images
                    : [];
            } catch (e) {
              // Si le parse échoue, initialiser un array vide
              imgs = [];
            }
          }

          setProject(project);
          setFormData({
            title: project.title || "",
            client: project.client || "",
            slug: project.slug || "",
            shortDesc: project.shortDesc || "",
            longDesc: project.longDesc || "",
            categories: cats,
            externalLink: project.externalLink || "",
            featured: project.featured || false,
          });
          setUploadedImages(imgs);
        } else {
          const data = await response.json();
          setError(data.error || "Failed to load project");
        }
      } catch (err) {
        setError("An error occurred while loading the project");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  // Check admin
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

  // Smooth scroll via lerp manuel
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    targetScrollLeft.current = 0;

    const smoothScroll = () => {
      const el = pageRef.current;
      if (!el) return;
      const diff = targetScrollLeft.current - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = targetScrollLeft.current;
        animating.current = false;
        return;
      }
      el.scrollLeft += diff * 0.08;
      requestAnimationFrame(smoothScroll);
    };

    const onWheel = (e) => {
      e.preventDefault();
      targetScrollLeft.current += e.deltaY * 2;
      // Recalcul dynamique du max à chaque event
      const max = el.scrollWidth - el.clientWidth;
      targetScrollLeft.current = Math.max(
        0,
        Math.min(targetScrollLeft.current, max),
      );

      if (!animating.current) {
        animating.current = true;
        smoothScroll();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [project]);

  // Close context menu on click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Auto-resize textarea for longDesc
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [formData.longDesc]);

  const isInitialLoad = useRef(true);
;

  // Drag and drop handlers for reorder modal
  const handleReorderDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleReorderDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleReorderDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleReorderDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Calculer la position finale de l'image déplacée après le splice
    let finalIndex = targetIndex;
    if (draggedIndex < targetIndex) {
      finalIndex = targetIndex - 1; // L'enlèvement décale la position
    }

    setUploadedImages((prev) => {
      const newArray = [...prev];
      const draggedImage = newArray[draggedIndex];
      newArray.splice(draggedIndex, 1);
      newArray.splice(targetIndex, 0, draggedImage);
      return newArray;
    });

    // Mettre à jour l'image sélectionnée pour qu'elle suive l'image déplacée
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return null;

      // Si l'image sélectionnée est celle qui est déplacée
      if (draggedIndex === prevIndex) {
        return finalIndex;
      }

      // Si l'image sélectionnée n'est pas celle déplacée, rester sur la même image
      // en recalculant son nouvel index après le réarrangement
      if (draggedIndex < prevIndex && targetIndex >= prevIndex) {
        return prevIndex - 1;
      }
      if (draggedIndex > prevIndex && targetIndex <= prevIndex) {
        return prevIndex + 1;
      }

      return prevIndex;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Image handlers
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedImages((prev) => [...prev, data.url]);
        } else {
          setError("Une image n'a pas pu être uploadée");
        }
      }
    } catch (err) {
      setError("Erreur lors de l'upload");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setContextMenu(null);
  };

  const moveImageUp = (index) => {
    if (index > 0) {
      setUploadedImages((prev) => {
        const newArray = [...prev];
        [newArray[index], newArray[index - 1]] = [
          newArray[index - 1],
          newArray[index],
        ];
        return newArray;
      });
      // Suivre l'image sélectionnée
      if (selectedImageIndex === index) {
        setSelectedImageIndex(index - 1);
      } else if (selectedImageIndex === index - 1) {
        setSelectedImageIndex(index);
      }
    }
    setContextMenu(null);
  };

  const moveImageDown = (index) => {
    if (index < uploadedImages.length - 1) {
      setUploadedImages((prev) => {
        const newArray = [...prev];
        [newArray[index], newArray[index + 1]] = [
          newArray[index + 1],
          newArray[index],
        ];
        return newArray;
      });
      // Suivre l'image sélectionnée
      if (selectedImageIndex === index) {
        setSelectedImageIndex(index + 1);
      } else if (selectedImageIndex === index + 1) {
        setSelectedImageIndex(index);
      }
    }
    setContextMenu(null);
  };

  const moveImageToFirst = (index) => {
    if (index !== 0) {
      setUploadedImages((prev) => {
        const img = prev[index];
        return [img, ...prev.slice(0, index), ...prev.slice(index + 1)];
      });
      // Suivre l'image sélectionnée
      if (selectedImageIndex === index) {
        setSelectedImageIndex(0);
      } else if (selectedImageIndex !== null && selectedImageIndex < index) {
        setSelectedImageIndex(selectedImageIndex + 1);
      }
    }
    setContextMenu(null);
  };

  const moveImageToLast = (index) => {
    if (index !== uploadedImages.length - 1) {
      setUploadedImages((prev) => {
        const img = prev[index];
        return [...prev.slice(0, index), ...prev.slice(index + 1), img];
      });
      // Suivre l'image sélectionnée
      if (selectedImageIndex === index) {
        setSelectedImageIndex(uploadedImages.length - 1);
      } else if (selectedImageIndex !== null && selectedImageIndex > index) {
        setSelectedImageIndex(selectedImageIndex - 1);
      }
    }
    setContextMenu(null);
  };

  const duplicateImage = (index) => {
    setUploadedImages((prev) => [
      ...prev.slice(0, index + 1),
      prev[index],
      ...prev.slice(index + 1),
    ]);
    setContextMenu(null);
  };

  const replaceImage = (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError("");

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadedImages((prev) => {
            const newArray = [...prev];
            newArray[index] = data.url;
            return newArray;
          });
        } else {
          setError("L'image n'a pas pu être remplacée");
        }
      } catch (err) {
        setError("Erreur lors du remplacement de l'image");
        console.error(err);
      } finally {
        setUploading(false);
        setContextMenu(null);
      }
    };
    input.click();
  };

  const handleImageContextMenu = (e, index) => {
    e.preventDefault();
    setContextMenu({
      index,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages,
          technologies: formData.categories,
        }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        setError("Failed to update project");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        {/* Nav skeleton */}
       

        <div className="flex flex-1 overflow-hidden pt-[36px]">
          {/* Left column skeleton */}
          <div className="w-fit fixed left-0 px-12 flex flex-col justify-start z-10">
            {/* Title */}
            <div className="h-5 w-48 bg-gray-200  animate-pulse mb-8" />

            <div className="flex gap-4">
              {/* Labels */}
              <div className="uppercase space-y-4">
                {["client", "slug", "short desc", "information"].map(
                  (label) => (
                    <div
                      key={label}
                      className="h-4 w-16 bg-gray-100  animate-pulse"
                    />
                  ),
                )}
              </div>
              {/* Values */}
              <div className="space-y-4">
                {[140, 180, 120, 140].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200  animate-pulse"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Upload + Save */}
            <div className="mt-8 pt-4 border-t border-gray-200 space-y-3">
              <div className="h-4 w-32 bg-gray-200  animate-pulse" />
              <div className="h-8 w-20 bg-gray-200  animate-pulse" />
            </div>
          </div>

          {/* Images area skeleton */}
          <div className="flex ml-140 h-full">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="shrink-0 h-full bg-gray-100 animate-pulse"
                style={{ width: "100vw", opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-20 px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Link
                href="/admin"
                className="text-blue-600 hover:underline text-sm"
              >
                ← Back to Admin
              </Link>
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      ref={pageRef}
      className="flex pb-12 pt-30.5 relative h-screen overflow-x-scroll overflow-y-hidden bg-white"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Navbar */}
  
      {/* LEFT COLUMN - fixe */}
      <div className="w-fit z-20 bg--300 fixed left-0 shrink-0 h-full text-whte mix-blnd-difference px-12  flex flex-col justify-start z-10">
        <h1 className="  font-bold mb-8 leading-tight">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-transparent border-b border-transparent focus:border-gray-400 uppercase w-full focus:outline-none"
            placeholder="Project title"
          />
        </h1>

        <div className="flex gap-4">
          <div className="uppercase space-y-4 text-gray-500">
            <p>client</p>
            <p>slug</p>
            <p>short desc</p>
            {/* <p>Type</p> */}
            <p>information</p>
          </div>
          <div className="space-y-4 flex flex-col">
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="bg-transparent focus:outline-none border-b border-transparent focus:border-gray-400"
              placeholder="Client"
            />
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="bg-transparent focus:outline-none border-b border-transparent focus:border-gray-400"
              placeholder="Slug"
            />
            <input
              type="text"
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              className="bg-transparent focus:outline-none border-b border-transparent focus:border-gray-400"
              placeholder="Short description"
            />

            <textarea
              ref={textareaRef}
              name="longDesc"
              value={formData.longDesc}
              onChange={handleChange}
              rows="1"
              className="bg-transparent focus:outline-none border-b border-transparent focus:border-gray-400 resize-none overflow-hidden"
              placeholder="Full description"
            />
          </div>
        </div>

      
          <OptionSelector
            options={["COMMERCIAL", "MUSIC VIDEO", "WEB"]}
            selectedValue={formData.categories}
            onValueChange={(categories) =>
              setFormData({ ...formData, categories })
            }
            isSingleSelect={true}
          />
      
      </div>

      {/* IMAGES */}
      <div className="flex   ml-140 shrink-0 relative">
        {uploadedImages.length > 0 ? (
          <>
            {uploadedImages.map((img, idx) => (
              <div
                key={idx}
                className={`shrink-0 flex relative group h-full transition-all cursor-pointer ${
                  selectedImageIndex === idx ? "ring-4 ring-blue-500" : ""
                }`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const x = e.clientX - rect.left;
                  setSelectedImageIndex(idx);
                  setSelectedImagePosition({ x, y });
                }}
              >
                <img
                  className="h-full w-full object-cover"
                  src={img}
                  alt=""
                  draggable={false}
                  onContextMenu={(e) => handleImageContextMenu(e, idx)}
                />

                {/* Action Bar - visible quand l'image est sélectionnée */}
                {selectedImageIndex === idx && selectedImagePosition && (
                  <div
                    className="absolute z-10 rounded-0 bg-white  bg flex gap-2 px-3 py-2"
                    style={{
                      top: `${selectedImagePosition.y}px`,
                      left: `${selectedImagePosition.x}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImageUp(idx);
                      }}
                      disabled={idx === 0}
                      className="p-2 hover:bg-gray-100  disabled:opacity-50 disabled:cursor-not-allowed transition"
                      title="Faire reculer"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.33333 15.8334L2.5 10.0001M2.5 10.0001L8.33333 4.16675M2.5 10.0001L17.5 10.0001"
                          stroke="#414651"
                          strokeWidth="1.66667"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImageDown(idx);
                      }}
                      disabled={idx === uploadedImages.length - 1}
                      className="p-2 hover:bg-gray-100  disabled:opacity-50 disabled:cursor-not-allowed transition"
                      title="Faire avancer"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.6667 15.8332L17.5 9.99984M17.5 9.99984L11.6667 4.1665M17.5 9.99984L2.5 9.99984"
                          stroke="#414651"
                          strokeWidth="1.66667"
                        />
                      </svg>
                    </button>
                    <div className="w-px bg-gray-300"></div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateImage(idx);
                      }}
                      className="p-2 hover:bg-gray-100  transition"
                      title="Dupliquer"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.52702 4.20054V1.68213H18.3604V12.5155H15.8589M12.4738 7.485H1.64048V18.3183H12.4738V7.485Z"
                          stroke="#414651"
                          stroke-width="1.66667"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        replaceImage(idx);
                      }}
                      className="p-2 hover:bg-gray-100  transition"
                      title="Remplacer"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.75 5.68941L13.8766 2.5L17.5 6.06514L7.375 16.0245L2.5 17.5L3.75164 12.8283L10.75 5.68941ZM10.75 5.68941L14.3734 9.25454"
                          stroke="#414651"
                          stroke-width="1.66667"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="p-2 hover:bg-red-100 text-red-600  transition"
                      title="Supprimer"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.75 7.2561V17.5H15.25V7.2561M6.625 5.42683H2.5M6.625 5.42683L8.17188 2.5H12.3438L13.375 5.42683M6.625 5.42683H13.375M17.5 5.42683H13.375M11.5 8.35366V14.939M8.5 8.35366V14.939"
                          stroke="#414651"
                          stroke-width="1.66667"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1  text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
                {/* Image counter */}
              </div>
            ))}
            {/* Upload section after images */}
            <div className="shrink-0 h-full w-120 px-12 bg-gray-100 border border-gray-200 border-dashed flex items-center justify-center text-gray-400">
              <span className="text-center">
                <p className="text-sm">Drag and drop an image, or Browse</p>
                <p className="text-xs mt-2">
                  Minimum 1600px width recommended Max 10MB each (20 for videos)
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  Browse files
                </Button>
              </span>
            </div>
          </>
        ) : (
            <div className="shrink-0 h-full w-120 px-12 bg-gray-100 border border-gray-200 border-dashed flex items-center justify-center text-gray-400">
            
              <span className="text-center">
              <p className="text-sm">No images</p>
                             <p className="text-xs mt-2">Upload images to get started</p>

                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  Browse files
                </Button>
              </span>
          </div>
        )}

        {/* Reorder Modal */}
        {isReorderModalOpen && (
          <div
            className="fixed inset-0 flex p-4 items-center justify-end z-50"
            ref={overlayRef}
            onClick={() => setIsReorderModalOpen(false)}
          >
            <div className="top-0 left-0 bg-black/50 w-full h-full absolute z-0"></div>
            <div
              ref={contentRef}
              className="bg-white p-8 z-10 w-full max-w-md flex flex-col justify-between h-full overflow-y-auto will-change-transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full">
                <h2 className="text-xl font-bold mb-6 uppercase">
                  Réorganiser
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleReorderDragStart(e, idx)}
                      onDragOver={(e) => handleReorderDragOver(e, idx)}
                      onDragLeave={handleReorderDragLeave}
                      onDrop={(e) => handleReorderDrop(e, idx)}
                      className={`flex items-center gap-3 p-3 border  transition cursor-grab active:cursor-grabbing ${
                        draggedIndex === idx
                          ? "opacity-50 border-gray-400 bg-gray-50"
                          : dragOverIndex === idx
                            ? "bg-blue-50 border-blue-400"
                            : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-2xl text-gray-400">≡</div>
                      <img
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-12 h-12 object-cover "
                        draggable="false"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Image {idx + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsReorderModalOpen(false)}
                  className="w-full"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="fixed bg-white border uppercase  z-50 text-xs"
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
            }}
          >
            {[
              {
                label: "Remplacer",
                onClick: () => replaceImage(contextMenu.index),
                disabled: false,
              },
              {
                label: "Dupliquer",
                onClick: () => duplicateImage(contextMenu.index),
                disabled: false,
              },
              {
                label: "Réorganiser",
                onClick: () => {
                  setReorderItemIndex(contextMenu.index);
                  setIsReorderModalOpen(true);
                  setContextMenu(null);
                },
                disabled: false,
              },
              {
                label: "Faire reculer",
                onClick: () => moveImageUp(contextMenu.index),
                disabled: contextMenu.index === 0,
              },
              {
                label: "Faire avancer",
                onClick: () => moveImageDown(contextMenu.index),
                disabled: contextMenu.index === uploadedImages.length - 1,
              },
              {
                label: "Première position",
                onClick: () => moveImageToFirst(contextMenu.index),
                disabled: contextMenu.index === 0,
              },
              {
                label: "Dernière position",
                onClick: () => moveImageToLast(contextMenu.index),
                disabled: contextMenu.index === uploadedImages.length - 1,
              },
              {
                label: "Supprimer",
                onClick: () => removeImage(contextMenu.index),
                disabled: false,
                isDelete: true,
              },
            ].map((action, idx, arr) => (
              <button
                key={idx}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                className={`block w-full uppercase text-left p-4 -2 py-2 ${
                  action.isDelete
                    ? "hover:bg-red-100 text-red-600"
                    : "hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* <Transition primaryColor="#000000" secondaryColor="#ffffff" /> */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </form>
  );
}
