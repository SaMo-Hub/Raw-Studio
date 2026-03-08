"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import StatusTag from "@/components/StatusTag";
import ToggleSwitch from "@/components/ToggleSwitch";
import Checkbox from "@/components/Checkbox";
import { Sidebar } from "@/components/Sidebar";

const CAROUSEL_TYPES = {
  athletes: "Sportifs de Raw Sport",
  press: "Relation de presse",
  clubs: "Club de foot",
};

export default function AdminRawSportHomePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importFiles, setImportFiles] = useState([]);
  const [selectedTypeImport, setSelectedTypeImport] = useState("athletes");
  const [showImportModal, setShowImportModal] = useState(false);
  const [borderStyle, setBorderStyle] = useState({ left: 0, width: 0 });
  const [groupByType, setGroupByType] = useState(true);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [draggedItem, setDraggedItem] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState({
    athletes: true,
    press: true,
    clubs: true,
  });
  const buttonRefs = useRef({
    ALL: null,
    athletes: null,
    press: null,
    clubs: null,
  });

  // Mettre à jour la position du border animé
  useEffect(() => {
    const button = buttonRefs.current[selectedType];
    if (button) {
      setBorderStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, [selectedType]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/raw-sport/home");
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

  const toggleType = (type) => {
    setSelectedType(type);
  };

  const filteredItems = items.filter((item) => {
    const typeMatch = selectedType === "ALL" || item.type === selectedType;
    const searchMatch = item.imageName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getTypeCount = (type) => {
    if (type === "ALL") return items.length;
    return items.filter((item) => item.type === type).length;
  };

  const getGroupedItems = () => {
    if (!groupByType) return { ALL: filteredItems };
    const grouped = {};
    ["athletes", "press", "clubs"].forEach((type) => {
      grouped[type] = filteredItems.filter((item) => item.type === type);
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

          const response = await fetch("/api/raw-sport/home", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageName: file.name.replace(/\.[^.]*$/, ""),
              imageUrl: uploadData.url,
              type: selectedTypeImport,
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
      const response = await fetch(`/api/raw-sport/home/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item)),
        );
      }
    } catch (err) {
      setError("Impossible de mettre à jour le statut");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Êtes-vous sûr?")) return;

    try {
      const response = await fetch(`/api/raw-sport/home/${id}`, {
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

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetItem) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    // Les items doivent être du même type
    if (draggedItem.type !== targetItem.type) {
      setDraggedItem(null);
      return;
    }

    try {
      // Récupérer les items du même type triés
      const sameTypeItems = items
        .filter((item) => item.type === draggedItem.type)
        .sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

      const draggedIndex = sameTypeItems.findIndex((item) => item.id === draggedItem.id);
      const targetIndex = sameTypeItems.findIndex((item) => item.id === targetItem.id);

      if (draggedIndex === targetIndex) {
        setDraggedItem(null);
        return;
      }

      // Créer un nouvel ordre
      const newOrder = [...sameTypeItems];
      const [draggedItemObj] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItemObj);

      // Préparer les mises à jour par lot
      const updates = newOrder.map((item, index) => {
        if (item.displayOrder !== index) {
          return fetch(`/api/raw-sport/home/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayOrder: index }),
          });
        }
        return Promise.resolve({ ok: true });
      });

      // Envoyer toutes les mises à jour en parallèle
      const responses = await Promise.all(updates);
      
      if (responses.every(r => r.ok)) {
        await fetchItems();
        setSuccess("Image déplacée");
      }
    } catch (err) {
      setError("Erreur lors du déplacement");
      console.error(err);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleMoveItemAsync = async (id, direction, callback) => {
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) {
        callback?.();
        return;
      }

      // Obtenir tous les items du même type
      const sameTypeItems = items.filter((item) => item.type === currentItem.type);
      
      // Trier par displayOrder, puis par createdAt
      sameTypeItems.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      const currentIndex = sameTypeItems.findIndex((item) => item.id === id);

      // Vérifier les limites
      if (direction === "up" && currentIndex === 0) {
        callback?.();
        return;
      }
      if (direction === "down" && currentIndex === sameTypeItems.length - 1) {
        callback?.();
        return;
      }

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const swapItem = sameTypeItems[newIndex];

      // Mettre à jour les displayOrder
      const updates = [];
      
      updates.push(
        fetch(`/api/raw-sport/home/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: newIndex }),
        })
      );

      updates.push(
        fetch(`/api/raw-sport/home/${swapItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: currentIndex }),
        })
      );

      const responses = await Promise.all(updates);
      
      if (responses.every(r => r.ok)) {
        await fetchItems();
      }
    } catch (err) {
      console.error(err);
    } finally {
      callback?.();
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleMoveItem = async (id, direction) => {
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;

      // Obtenir tous les items du même type
      const sameTypeItems = items.filter((item) => item.type === currentItem.type);
      
      // Trier par displayOrder, puis par createdAt pour les items avec le même displayOrder
      sameTypeItems.sort((a, b) => {
        if (a.displayOrder !== b.displayOrder) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      const currentIndex = sameTypeItems.findIndex((item) => item.id === id);

      // Vérifier les limites
      if (direction === "up" && currentIndex === 0) return;
      if (direction === "down" && currentIndex === sameTypeItems.length - 1) return;

      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const swapItem = sameTypeItems[newIndex];

      // Assigner les nouveaux displayOrder basés sur l'index
      const updates = [];
      
      // Mettre à jour l'item courant avec le nouvel index
      updates.push(
        fetch(`/api/raw-sport/home/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: newIndex }),
        })
      );

      // Mettre à jour l'item à échanger
      updates.push(
        fetch(`/api/raw-sport/home/${swapItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: currentIndex }),
        })
      );

      const responses = await Promise.all(updates);
      
      if (responses.every(r => r.ok)) {
        // Rafraîchir la liste
        fetchItems();
        setSuccess("Position mise à jour");
      }
    } catch (err) {
      setError("Erreur lors du déplacement");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pl-56 w-full flex bg-white">
      <Sidebar />

      <div className="px-6 w-full py-4">
        <div className="w-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-tight">
                Raw+Sport Home
              </h1>
              <p className="text-gray-600 text-xs mt-1">
                Manage carousel items
              </p>
            </div>

            {!showImportModal && (
              <Button onClick={() => fileInputRef.current?.click()} size="md">
                + Add item
              </Button>
            )}
          </div>

          {/* Filtres et Recherche */}
          <div className="mb-3">
            <div className="relative mb-3">
              <div className="flex gap-4">
                {["ALL", "athletes", "press", "clubs"].map((type) => (
                  <button
                    key={type}
                    ref={(el) => {
                      if (el) buttonRefs.current[type] = el;
                    }}
                    onClick={() => {
                      setSelectedType(type);
                    }}
                    className={`pb-2 transition relative flex items-center overflow-hidden group ${
                      selectedType === type
                        ? "text-black font-medium"
                        : "text-gray-600 hover:text-black"
                    }`}
                  >
                    <span className="relative inline-block overflow-hidden h-4">
                      <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                        {type === "ALL" ? "ALL" : CAROUSEL_TYPES[type]}
                      </span>
                      <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0">
                        {type === "ALL" ? "ALL" : CAROUSEL_TYPES[type]}
                      </span>
                    </span>
                    <span className="ml-1 text-xs text-gray-500">
                      ({getTypeCount(type)})
                    </span>
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
                placeholder="Search for items"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-fit px-4 pl-8 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-xs">
              {success}
            </div>
          )}

          {/* Gallery View */}
          <div className="mb-6 flex items-center justify-between">
            <div></div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`text-xs px-3 py-1.5  transition border ${
                  viewMode === "cards"
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                🎴 Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`text-xs px-3 py-1.5  transition border ${
                  viewMode === "table"
                    ? "bg-black text-white border-black"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                📋 Tableau
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun élément</p>
            </div>
          ) : viewMode === "table" ? (
            // Vue Tableau
            <div>
              <div className="text-sm">
                {/* Table Header */}
                {filteredItems.length > 0 && (
                  <div className="mb-4 grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 text-xs uppercase font-medium text-black/30 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          selectedItems.size === filteredItems.length &&
                          filteredItems.length > 0
                        }
                        indeterminate={
                          selectedItems.size > 0 &&
                          selectedItems.size < filteredItems.length
                        }
                        onChange={() => {
                          if (selectedItems.size === filteredItems.length) {
                            setSelectedItems(new Set());
                          } else {
                            setSelectedItems(
                              new Set(filteredItems.map((item) => item.id)),
                            );
                          }
                        }}
                      />
                      <span>Nom</span>
                    </div>
                    <div>Type</div>
                    <div>Date</div>
                    <div>État</div>
                    {selectedItems.size > 0 ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            for (const id of selectedItems) {
                              handleToggleActive(
                                id,
                                !filteredItems.find((item) => item.id === id)
                                  ?.isActive,
                              );
                            }
                          }}
                          className="px-3 py-1 bg-green-500 text-white text-xs hover:bg-green-600 transition"
                        >
                          Toggle ({selectedItems.size})
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Êtes-vous sûr de vouloir supprime ces éléments ?",
                              )
                            ) {
                              for (const id of selectedItems) {
                                handleDeleteItem(id);
                              }
                              setSelectedItems(new Set());
                            }
                          }}
                          className="px-3 py-1 bg-red-500 text-white text-xs hover:bg-red-600 transition"
                        >
                          Delete ({selectedItems.size})
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">Actions</div>
                    )}
                  </div>
                )}

                {/* Rows */}
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-5 gap-4 items-center p-4 border-b border-gray-200 transition ${
                      selectedItems.has(item.id)
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex w-full overflow-hidden items-center gap-3">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onChange={() => {
                          const newSelected = new Set(selectedItems);
                          if (newSelected.has(item.id)) {
                            newSelected.delete(item.id);
                          } else {
                            newSelected.add(item.id);
                          }
                          setSelectedItems(newSelected);
                        }}
                      />
                      <img
                        src={item.imageUrl}
                        alt={item.imageName}
                        className="w-10 h-10 object-cover "
                      />
                      <p className="font-medium truncate w-full text-xs">
                        {item.imageName}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-3 py-1 -full font-medium ${
                          item.type === "athletes"
                            ? "bg-blue-100 text-blue-700"
                            : item.type === "press"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {CAROUSEL_TYPES[item.type]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    <div>
                      <StatusTag isActive={item.isActive} />
                    </div>
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => handleMoveItem(item.id, "up")}
                        className="text-gray-600 hover:text-blue-600 transition text-sm"
                        title="Move Up"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveItem(item.id, "down")}
                        className="text-gray-600 hover:text-blue-600 transition text-sm"
                        title="Move Down"
                      >
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <ToggleSwitch
                        isActive={item.isActive}
                        onChange={(newStatus) =>
                          handleToggleActive(item.id, !newStatus)
                        }
                      />
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-600 hover:text-red-600 transition text-sm"
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
            </div>
          ) : (
            <div>
              {groupByType &&
                // Vue groupée par type
                Object.entries(getGroupedItems()).map(
                  ([type, items]) =>
                    items.length > 0 && (
                      <div key={type} className="mb-4">
                        <div
                          className="flex items-center justify-between mb-2  cursor-pointer group"
                          onClick={() =>
                            setExpandedTypes((prev) => ({
                              ...prev,
                              [type]: !prev[type],
                            }))
                          }
                        >
                          <div className="flex items-center gap-1">
                            <span
                              className={`text- transition-transform ${expandedTypes[type] ? "rotate-90" : ""}`}
                            >
                              ▶
                            </span>
                            <h2 className=" font-bold  tracking-tight group-hover:text-gray-600 transition">
                              {type === "ALL" ? "Tous" : CAROUSEL_TYPES[type]}
                              <span className="ml-1">({items.length})</span>
                            </h2>
                          </div>
                        </div>

                        {expandedTypes[type] && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className={`group relative -lg overflow-hidden transition ${
                                  draggedItem?.id === item.id ? "opacity-50" : ""
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, item)}
                                onDragLeave={() => {}}
                              >
                                {/* Image */}
                                <div className="aspect-square relative overflow-hidden">
                                 
                                    <div
                                     
                                      className="bg-white cursor-grab hover:cursor-grabbing z-20 h-6 w-6 flex items-center justify-center ml-2 mt-2 absolute"
                                    >
                                      <svg
                                        width="8"
                                        height="12"
                                        viewBox="0 0 8 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          width="3"
                                          height="3"
                                          rx="1.5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="5"
                                          width="3"
                                          height="3"
                                          rx="1.5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          y="4.5"
                                          width="3"
                                          height="3"
                                          rx="1.5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="5"
                                          y="4.5"
                                          width="3"
                                          height="3"
                                          rx="1.5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          y="9"
                                          width="3"
                                          height="3"
                                          rx="1.5"
                                          fill="currentColor"
                                        />
                                        <rect
                                          x="5"
                                          y="9"
                                          width="3"
                                          height="3"
                                          rx="1.5"
                                          fill="currentColor"
                                        />
                                      </svg>
                                    </div>
                                 
                                  <img
                                    src={item.imageUrl}
                                    alt={item.imageName}
                                    className="w-full h-full object-cover 00"
                                  />

                                  <div className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex  gap-3 opacity-0 group-hover:opacity-100">
                                    <div className="flex absolute gap-2 right-0 mt-2 mr-2">
                                 
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleActive(
                                          item.id,
                                          item.isActive,
                                        );
                                      }}
                                      className="bg-white z-20 h-6 w-6 flex items-center justify-center hover:bg-gray-100 transition"
                                      title="Toggle Active"
                                    >
                                      <svg
                                        className="w-4 h-5 text-gray-800"
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
                                      className="bg-red-500 z-20 h-6 w-6 flex items-center justify-center hover:bg-red-700 transition text-white"
                                      title="Delete"
                                    >
                                      <svg
                                        className="w-4 h-4"
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
                                  </div>
                                </div>

                                {/* Overlay Actions */}

                                {/* Info Bar */}
                                <div className="pt-2">
                                  <p className="text-xs font-medium text-gray-800 truncate">
                                    {item.imageName}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        item.createdAt,
                                      ).toLocaleDateString("fr-FR")}
                                    </span>
                                    <div
                                      className={`text-xs px-2 py-0.5 -full ${
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
                    ),
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
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">ADD ITEMS</h2>
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
              <p className="text-xs font-medium mb-3 text-gray-700">
                {importFiles.length} FILES
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  {importFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 bg-gray0  border-b border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-10 h-10  object-cover"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setImportFiles((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="ml-4 text-gray-400 hover:text-red-600 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {/* Upload Zone */}

                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 -lg p-6 text-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-xs text-gray-600 mb-2">
                    Click or drag files here
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse files
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
            </div>

            {/* Type Selector */}
            <div className="flex gap-4 mb-6 w-full">
              <div className="w-full">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  TYPE*
                </label>
                <select
                  value={selectedTypeImport}
                  onChange={(e) => setSelectedTypeImport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300  bg-white text-xs focus:outline-none focus:border-black"
                >
                  {Object.entries(CAROUSEL_TYPES).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block uppercase text-xs font-medium text-gray-700 mb-2">
                  Client
                </label>
                <select
                  value={selectedTypeImport}
                  onChange={(e) => setSelectedTypeImport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300  bg-white text-xs focus:outline-none focus:border-black"
                >
                  {Object.entries(CAROUSEL_TYPES).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFiles([]);
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300  font-medium hover:bg-gray-50 transition"
              >
                CANCEL
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-6 py-2 bg-black text-white  font-medium hover:bg-gray-800 transition"
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
