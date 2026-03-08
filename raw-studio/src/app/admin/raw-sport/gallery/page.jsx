"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import StatusTag from "@/components/StatusTag";
import ToggleSwitch from "@/components/ToggleSwitch";
import Checkbox from "@/components/Checkbox";
import { Sidebar } from "@/components/Sidebar";

const GALLERY_CATEGORIES = {
  photo: "Photo",
  "graphic-design": "Graphic Design",
  film: "Film",
};

export default function AdminRawSportGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importFiles, setImportFiles] = useState([]);
  const [selectedCategoryImport, setSelectedCategoryImport] = useState("photo");
  const [showImportModal, setShowImportModal] = useState(false);
  const [borderStyle, setBorderStyle] = useState({ left: 0, width: 0 });
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({
    photo: true,
    "graphic-design": true,
    film: true,
  });
  const buttonRefs = useRef({ ALL: null, photo: null, "graphic-design": null, film: null });

  // Mettre à jour la position du border animé
  useEffect(() => {
    const button = buttonRefs.current[selectedCategory];
    if (button) {
      setBorderStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/raw-sport/gallery");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Failed to load items:", err);
      setError("Impossible de charger les éléments");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategory(category);
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch = selectedCategory === "ALL" || item.category === selectedCategory;
    const searchMatch = item.imageName.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getCategoryCount = (category) => {
    if (category === "ALL") return items.length;
    return items.filter((item) => item.category === category).length;
  };

  const getGroupedItems = () => {
    if (!groupByCategory) return { ALL: filteredItems };
    const grouped = {};
    ["photo", "graphic-design", "film"].forEach((cat) => {
      grouped[cat] = filteredItems.filter((item) => item.category === cat);
    });
    return grouped;
  };

  const handleImportFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImportFiles((prev) => [...prev, ...files]);
      setShowImportModal(true);
    }
  };

  const handleImportSubmit = async () => {
    if (importFiles.length === 0) {
      setError("Veuillez ajouter au moins une image");
      return;
    }

    try {
      for (const file of importFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();

          const response = await fetch("/api/raw-sport/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageName: file.name.replace(/\.[^.]*$/, ""),
              imageUrl: uploadData.url,
              category: selectedCategoryImport,
              isActive: true,
            }),
          });

          if (response.ok) {
            const addedItem = await response.json();
            setItems((prev) => [...prev, addedItem]);
          }
        }
      }
      setImportFiles([]);
      setShowImportModal(false);
      setSuccess("Éléments importés avec succès");
      fileInputRef.current.value = "";
    } catch (err) {
      setError("Erreur lors de l'import");
      console.error(err);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/raw-sport/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
      }
    } catch (err) {
      setError("Impossible de mettre à jour le statut");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Êtes-vous sûr?")) return;

    try {
      const response = await fetch(`/api/raw-sport/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSuccess("Élément supprimé");
      }
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen pl-56 w-full flex bg-white">
      <Sidebar />

      <div className="px-6 w-full py-4">
        <div className="w-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-tight">Raw+Sport Gallery</h1>
              <p className="text-gray-600 text-sm mt-1">Manage gallery media</p>
            </div>

            {!showImportModal && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="md"
              >
                + Add media
              </Button>
            )}
          </div>

          {/* Filtres et Recherche */}
          <div className="mb-3">
            <div className="relative mb-3">
              <div className="flex gap-4">
                {["ALL", "photo", "graphic-design", "film"].map((category) => (
                  <button
                    key={category}
                    ref={(el) => {
                      if (el) buttonRefs.current[category] = el;
                    }}
                    onClick={() => {
                      setSelectedCategory(category);
                    }}
                    className={`pb-2 transition relative flex items-center overflow-hidden group ${
                      selectedCategory === category
                        ? "text-black font-medium"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <span className="relative inline-block overflow-hidden h-4">
                      <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                        {category === "ALL" ? "ALL" : GALLERY_CATEGORIES[category]}
                      </span>
                      <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0">
                        {category === "ALL" ? "ALL" : GALLERY_CATEGORIES[category]}
                      </span>
                    </span>
                    <span className="ml-1 text-xs text-gray-500">({getCategoryCount(category)})</span>
                  </button>
                ))}
              </div>
              {/* Border animé */}
              <div
                className="absolute bottom-0 h-[1.8px] bg-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: `${borderStyle.left}px`,
                  width: `${borderStyle.width}px`,
                }}
              />
            </div>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <svg
                className="absolute left-2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for media"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-fit px-4 pl-8 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Gallery View */}
          <div className="mb-6 flex items-center justify-between">
            <div></div>
            <button
              onClick={() => setGroupByCategory(!groupByCategory)}
              className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              {groupByCategory ? "🔓 Groupé" : "📋 Dégroupé"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun élément</p>
            </div>
          ) : (
            <div>
              {groupByCategory ? (
                // Vue groupée par catégorie
                Object.entries(getGroupedItems()).map(([category, items]) => (
                  items.length > 0 && (
                    <div key={category} className="mb-12">
                      <div
                        className="flex items-center justify-between mb-6 cursor-pointer group"
                        onClick={() =>
                          setExpandedCategories((prev) => ({
                            ...prev,
                            [category]: !prev[category],
                          }))
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-lg transition-transform ${expandedCategories[category] ? "rotate-90" : ""}`}>
                            ▶
                          </span>
                          <h2 className="text-2xl font-bold uppercase tracking-tight group-hover:text-gray-600 transition">
                            {category === "ALL"
                              ? "Tous"
                              : GALLERY_CATEGORIES[category]}
                          </h2>
                          <span className="text-sm text-gray-500 ml-2">
                            ({items.length})
                          </span>
                        </div>
                      </div>

                      {expandedCategories[category] && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="group relative rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition"
                            >
                              {/* Image */}
                              <div className="aspect-square overflow-hidden">
                                <img
                                  src={item.imageUrl}
                                  alt={item.imageName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Overlay Actions */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleActive(item.id, item.isActive);
                                  }}
                                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                                  title="Toggle Active"
                                >
                                  <svg
                                    className="w-5 h-5 text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item.id);
                                  }}
                                  className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition text-white"
                                  title="Delete"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Info Bar */}
                              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-xs font-medium text-gray-800 truncate">
                                  {item.imageName}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                                  </span>
                                  <div
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      item.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {item.isActive ? "ACTIF" : "INACTIF"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))
              ) : (
                // Vue dégroupée
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition"
                    >
                      {/* Image */}
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.imageName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(item.id, item.isActive);
                          }}
                          className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                          title="Toggle Active"
                        >
                          <svg
                            className="w-5 h-5 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition text-white"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Info Bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {item.imageName}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.category === "photo"
                                ? "bg-blue-100 text-blue-700"
                                : item.category === "graphic-design"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {GALLERY_CATEGORIES[item.category]}
                          </span>
                          <div
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              item.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.isActive ? "ACTIF" : "INACTIF"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for initial import trigger */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImportFiles}
        hidden
      />

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">ADD MEDIA</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFiles([]);
                }}
                className="text-gray-400 hover:text-black text-2xl font-light"
              >
                ×
              </button>
            </div>

            {/* Files to import */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3 text-gray-700">
                {importFiles.length} FILES
              </p>
              <div className="space-y-2">
                {importFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setImportFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="ml-4 text-gray-400 hover:text-red-600 text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Zone */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">Cliquez ou déposez les fichiers ici</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Parcourir les fichiers
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImportFiles}
                  hidden
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CATÉGORIE*
              </label>
              <select
                value={selectedCategoryImport}
                onChange={(e) => setSelectedCategoryImport(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-black"
              >
                {Object.entries(GALLERY_CATEGORIES).map(([category, label]) => (
                  <option key={category} value={category}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Activate Toggle */}
            <div className="mb-8 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">ACTIVATE</label>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFiles([]);
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
              >
                CANCEL
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-6 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition"
              >
                ✓ ADD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
