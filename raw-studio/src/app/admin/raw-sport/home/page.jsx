"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/Button";
import StatusTag from "@/components/StatusTag";
import ToggleSwitch from "@/components/ToggleSwitch";
import Checkbox from "@/components/Checkbox";
import TextField from "@/components/TextField";
import { Sidebar } from "@/components/Sidebar";
import SelectField from "@/components/SelectField";
import { ToastContainer } from "@/components/Toast";

const CAROUSEL_TYPES = {
  athletes: "Sportifs de Raw Sport",
  press: "Relation de presse",
  clubs: "Club de foot",
};

// ─── Ghost image qui suit le curseur (via ref, zéro rerender) ───
function DragGhost({ ghostRef }) {
  return (
    <div
      ref={ghostRef}
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 9999,
        display: "none",
        transformOrigin: "top left",
        transform: "rotate(2.5deg) scale(1.04)",
        boxow: "0 24px 48px rgba(0,0,0,0.32)",
        opacity: 0.97,
        willChange: "left, top",
        transition: "none",
      }}
    >
      <img
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        draggable={false}
        alt=""
      />
    </div>
  );
}

// ─── FLIP SortableGrid ─── les cards glissent vraiment ───
function SortableGrid({
  items,
  type,
  onReorder,
  onToggleActive,
  onDelete,
  onEdit,
}) {
  const [order, setOrder] = useState(() => items.map((i) => i.id));
  const [draggingId, setDraggingId] = useState(null);

  const cardRefs = useRef({});
  const ghostRef = useRef(null);
  const dragState = useRef(null);
  const prevRectsRef = useRef({});

  useEffect(() => {
    setOrder(items.map((i) => i.id));
  }, [items]);

  const getOrderedItems = (currentOrder = order) =>
    currentOrder.map((id) => items.find((i) => i.id === id)).filter(Boolean);

  // FLIP étape 1 : snapshot toutes les positions actuelles
  const snapshotRects = () => {
    const snap = {};
    Object.entries(cardRefs.current).forEach(([id, el]) => {
      if (el) snap[id] = el.getBoundingClientRect();
    });
    prevRectsRef.current = snap;
  };

  // FLIP étape 2 : après render, animer depuis ancienne → nouvelle position
  // FLIP étape 2 corrigée
  const playFlip = (skipId) => {
    const prev = prevRectsRef.current;
    Object.entries(cardRefs.current).forEach(([id, el]) => {
      if (!el || !prev[id] || id === skipId) return;
      const next = el.getBoundingClientRect();
      const dx = prev[id].left - next.left;
      const dy = prev[id].top - next.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      // Force reflow AVANT de poser la transition
      el.getBoundingClientRect(); // <-- force reflow

      el.style.transition = "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "";
    });
  };
  // Calcul du nouvel ordre basé sur la position du curseur
  const computeNewOrder = (clientX, clientY, currentOrder, draggedId) => {
    // Récupérer les rects de toutes les cards sauf celle draguée
    const others = currentOrder
      .filter((id) => id !== draggedId)
      .map((id) => {
        const el = cardRefs.current[id];
        if (!el) return null;
        return { id, rect: el.getBoundingClientRect() };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const rowDiff = a.rect.top - b.rect.top;
        return Math.abs(rowDiff) > 10 ? rowDiff : a.rect.left - b.rect.left;
      });

    // Trouver l'index d'insertion
    let insertBefore = null;
    for (const { id, rect } of others) {
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;
      if (clientY < rect.top + rect.height * 0.6) {
        if (clientX < midX) {
          insertBefore = id;
          break;
        }
      }
    }

    const withoutDragged = currentOrder.filter((id) => id !== draggedId);
    if (insertBefore === null) return [...withoutDragged, draggedId];
    const idx = withoutDragged.indexOf(insertBefore);
    const next = [...withoutDragged];
    next.splice(idx, 0, draggedId);
    return next;
  };

  const handlePointerDown = (e, item) => {
    if (e.button !== 0) return;
    const card = cardRefs.current[item.id];
    if (!card) return;
    const rect = card.getBoundingClientRect();

    dragState.current = {
      itemId: item.id,
      startX: e.clientX,
      startY: e.clientY,
      started: false,
      currentOrder: [...order],
      offsetX: 0,
      offsetY: 0,
    };

    const onMove = (ev) => {
      const ds = dragState.current;
      if (!ds) return;

      if (!ds.started) {
        if (Math.hypot(ev.clientX - ds.startX, ev.clientY - ds.startY) < 5)
          return;
        ds.started = true;
        ds.offsetX = ev.clientX - rect.left;
        ds.offsetY = ev.clientY - rect.top;

        // Init ghost via DOM direct (pas de setState)
        const g = ghostRef.current;
        if (g) {
          g.querySelector("img").src = item.imageUrl;
          g.style.width = `${rect.width}px`;
          g.style.height = `${rect.height}px`;
          g.style.left = `${ev.clientX - ds.offsetX}px`;
          g.style.top = `${ev.clientY - ds.offsetY}px`;
          g.style.display = "block";
        }
        // Card source : transparente via DOM direct
        card.style.opacity = "0.12";
        card.style.transition = "opacity 0.12s ease";

        setDraggingId(item.id); // un seul setState au début
      }

      // Déplacer le ghost sans aucun setState
      const g = ghostRef.current;
      if (g) {
        g.style.left = `${ev.clientX - ds.offsetX}px`;
        g.style.top = `${ev.clientY - ds.offsetY}px`;
      }

      // Calculer le nouvel ordre
      const newOrder = computeNewOrder(
        ev.clientX,
        ev.clientY,
        ds.currentOrder,
        item.id,
      );
      const changed = newOrder.some((id, i) => id !== ds.currentOrder[i]);

      if (changed) {
        ds.currentOrder = newOrder;
        snapshotRects();
        setOrder(newOrder);
        // Un seul rAF suffit si on force le reflow dans playFlip
        requestAnimationFrame(() => playFlip(item.id));
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      const ds = dragState.current;
      if (!ds?.started) {
        dragState.current = null;
        return;
      }

      const finalOrder = [...ds.currentOrder];
      dragState.current = null;

      // Masquer ghost
      if (ghostRef.current) ghostRef.current.style.display = "none";
      // Restaurer card
      if (card) {
        card.style.opacity = "";
        card.style.transition = "";
      }

      setDraggingId(null);
      onReorder(finalOrder, type);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    e.preventDefault();
  };

  const orderedItems = getOrderedItems();

  return (
    <>
      <DragGhost ghostRef={ghostRef} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
        }}
      >
        {orderedItems.map((item) => {
          const isDragging = draggingId === item.id;
          return (
            <div
              key={item.id}
              data-card-id={item.id}
              ref={(el) => {
                if (el) cardRefs.current[item.id] = el;
              }}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                touchAction: "none",
                willChange: "transform",
              }}
              className="group relative overflow-——"
              onPointerDown={(e) => handlePointerDown(e, item)}
            >
              <div className="aspect-square relative overflow-hidden">
                <div className="bg-white z-20 h-6 w-6 flex items-center justify-center ml-2 mt-2 absolute opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <rect width="3" height="3" rx="1.5" fill="currentColor" />
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
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="flex absolute gap-2 right-0 mt-2 mr-2">
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="bg-blue-500 z-20 h-6 w-6 flex items-center justify-center hover:bg-blue-600 transition text-white"
                      title="Éditer"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleActive(item.id, item.isActive);
                      }}
                      className="bg-white z-20 h-6 w-6 flex items-center justify-center hover:bg-gray-100 transition"
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
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="bg-red-500 z-20 h-6 w-6 flex items-center justify-center hover:bg-red-700 transition text-white"
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
              <div className="pt-2">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {item.imageName}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  <div
                    className={`text-xs px-2 py-0.5 ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {item.isActive ? "ACTIF" : "INACTIF"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Page principale ───
export default function AdminRawSportHomePage() {
  const fileInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toasts, setToasts] = useState([]);
  const [importFiles, setImportFiles] = useState([]);
  const [selectedTypeImport, setSelectedTypeImport] = useState("athletes");
  const [selectedClient, setSelectedClient] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    imageName: "",
    type: "",
    client: "",
  });
  const [editIsActive, setEditIsActive] = useState(true);
  const [borderStyle, setBorderStyle] = useState({ left: 0, width: 0 });
  const [viewMode, setViewMode] = useState("cards");
  const [selectedItems, setSelectedItems] = useState(new Set());
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

  useEffect(() => {
    const button = buttonRefs.current[selectedType];
    if (button)
      setBorderStyle({ left: button.offsetLeft, width: button.offsetWidth });
  }, [selectedType]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/raw-sport/home");
      if (response.ok) setItems(await response.json());
    } catch (err) {
      showToast("Impossible de charger les éléments", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show toasts
  const showToast = useCallback((message, type = "success") => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, text: message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const filteredItems = items.filter((item) => {
    const typeMatch = selectedType === "ALL" || item.type === selectedType;
    const searchMatch = item.imageName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const getTypeCount = (type) =>
    type === "ALL" ? items.length : items.filter((i) => i.type === type).length;

  const getGroupedItems = () => {
    const grouped = {};
    ["athletes", "press", "clubs"].forEach((type) => {
      grouped[type] = filteredItems
        .filter((item) => item.type === type)
        .sort((a, b) =>
          a.displayOrder !== b.displayOrder
            ? a.displayOrder - b.displayOrder
            : new Date(a.createdAt) - new Date(b.createdAt),
        );
    });
    return grouped;
  };

  const handleReorder = useCallback(async (newIdOrder, type) => {
    try {
      const responses = await Promise.all(
        newIdOrder.map((id, index) =>
          fetch(`/api/raw-sport/home/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ displayOrder: index }),
          }),
        ),
      );
      if (responses.every((r) => r.ok)) {
        setItems((prev) => {
          const updated = prev.map((item) => {
            const idx = newIdOrder.indexOf(item.id);
            return idx !== -1 ? { ...item, displayOrder: idx } : item;
          });
          return updated;
        });
        setSuccess("Ordre sauvegardé");
      }
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
    }
  }, []);

  const handleImportFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImportFiles((prev) => [...prev, ...files]);
      setShowImportModal(true);
    }
  };

  const handleImportSubmit = async () => {
    if (importFiles.length === 0) {
      showToast("Veuillez ajouter au moins une image", "error");
      return;
    }
    if (!selectedClient.trim()) {
      showToast("Veuillez ajouter un client", "error");
      return;
    }
    try {
      for (const file of importFiles) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          const res = await fetch("/api/raw-sport/home", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageName: file.name.replace(/\.[^.]*$/, ""),
              imageUrl: url,
              type: selectedTypeImport,
              client: selectedClient,
              isActive: true,
            }),
          });
          if (res.ok) {
            const addedItem = await res.json();
            setItems((prev) => [...prev, addedItem]);
          }
        }
      }
      setImportFiles([]);
      setSelectedClient("");
      setShowImportModal(false);
      showToast("Éléments importés avec succès", "success");
      fileInputRef.current.value = "";
    } catch (err) {
      showToast("Erreur lors de l'import", "error");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/raw-sport/home/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok)
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item,
          ),
        );
    } catch (err) {
      showToast("Impossible de mettre à jour le statut", "error");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Êtes-vous sûr?")) return;
    try {
      const res = await fetch(`/api/raw-sport/home/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        showToast("Élément supprimé", "success");
      }
    } catch (err) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleMoveItem = async (id, direction) => {
    try {
      const currentItem = items.find((item) => item.id === id);
      if (!currentItem) return;
      const sameTypeItems = items
        .filter((item) => item.type === currentItem.type)
        .sort((a, b) =>
          a.displayOrder !== b.displayOrder
            ? a.displayOrder - b.displayOrder
            : new Date(a.createdAt) - new Date(b.createdAt),
        );
      const currentIndex = sameTypeItems.findIndex((item) => item.id === id);
      if (direction === "up" && currentIndex === 0) return;
      if (direction === "down" && currentIndex === sameTypeItems.length - 1)
        return;
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const swapItem = sameTypeItems[newIndex];
      const responses = await Promise.all([
        fetch(`/api/raw-sport/home/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: newIndex }),
        }),
        fetch(`/api/raw-sport/home/${swapItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayOrder: currentIndex }),
        }),
      ]);
      if (responses.every((r) => r.ok)) {
        fetchItems();
        showToast("Position mise à jour", "success");
      }
    } catch (err) {
      showToast("Erreur lors du déplacement", "error");
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      imageName: item.imageName,
      type: item.type,
      client: item.client || "",
    });
    setEditIsActive(item.isActive);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editFormData.imageName.trim()) {
      showToast("Le nom ne peut pas être vide", "error");
      return;
    }
    try {
      const res = await fetch(`/api/raw-sport/home/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageName: editFormData.imageName,
          type: editFormData.type,
          client: editFormData.client || null,
          isActive: editIsActive,
        }),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updatedItem : item)),
        );
        setShowEditModal(false);
        setEditingItem(null);
        showToast("Élément modifié avec succès", "success");
      }
    } catch (err) {
      showToast("Erreur lors de la modification", "error");
    }
  };

  const groupedItems = getGroupedItems();

  return (
    <div className="min-h-screen font-neu pl-56 w-full flex bg-white">
      <Sidebar />

      <div className="px-6 w-full py-4">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold uppercase -tight">
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

          {/* Filtres */}
          <div className="mb-3">
            <div className="relative mb-3">
              <div className="flex gap-4">
                {["ALL", "athletes", "press", "clubs"].map((type) => (
                  <button
                    key={type}
                    ref={(el) => {
                      if (el) buttonRefs.current[type] = el;
                    }}
                    onClick={() => setSelectedType(type)}
                    className={`pb-2 transition relative flex items-center overflow-hidden group ${selectedType === type ? "text-black font-medium" : "text-gray-600 hover:text-black"}`}
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
              <div
                className="absolute bottom-0 h-[1.8px] bg-black transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: `${borderStyle.left}px`,
                  width: `${borderStyle.width}px`,
                }}
              />
            </div>

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

          {/* Toggle vue */}
          <div className="mb-6 flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`text-xs px-3 py-1.5 transition border ${viewMode === "cards" ? "bg-black text-white border-black" : "border-gray-300 hover:bg-gray-50"}`}
              >
                🎴 Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`text-xs px-3 py-1.5 transition border ${viewMode === "table" ? "bg-black text-white border-black" : "border-gray-300 hover:bg-gray-50"}`}
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
            // ─── VUE TABLEAU ───
            <div className="text-sm">
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
                        if (selectedItems.size === filteredItems.length)
                          setSelectedItems(new Set());
                        else
                          setSelectedItems(
                            new Set(filteredItems.map((item) => item.id)),
                          );
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
                          for (const id of selectedItems)
                            handleToggleActive(
                              id,
                              !filteredItems.find((item) => item.id === id)
                                ?.isActive,
                            );
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-xs hover:bg-green-600 transition"
                      >
                        Toggle ({selectedItems.size})
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Êtes-vous sûr?")) {
                            for (const id of selectedItems)
                              handleDeleteItem(id);
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
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-5 gap-4 items-center p-4 border-b border-gray-200 transition ${selectedItems.has(item.id) ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  <div className="flex w-full overflow-hidden items-center gap-3">
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onChange={() => {
                        const newSelected = new Set(selectedItems);
                        if (newSelected.has(item.id))
                          newSelected.delete(item.id);
                        else newSelected.add(item.id);
                        setSelectedItems(newSelected);
                      }}
                    />
                    <img
                      src={item.imageUrl}
                      alt={item.imageName}
                      className="w-10 h-10 object-cover"
                    />
                    <p className="font-medium truncate w-full text-xs">
                      {item.imageName}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs px-3 py-1 font-medium ${item.type === "athletes" ? "bg-blue-100 text-blue-700" : item.type === "press" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}
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
                      onClick={() => openEditModal(item)}
                      className="text-gray-600 hover:text-blue-600 transition"
                      title="Éditer"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveItem(item.id, "up")}
                      className="text-gray-600 hover:text-blue-600 transition"
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
                      className="text-gray-600 hover:text-blue-600 transition"
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
                      className="text-gray-600 hover:text-red-600 transition"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
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
          ) : (
            // ─── VUE CARDS ───
            <div>
              {["athletes", "press", "clubs"].map((type) => {
                const typeItems = groupedItems[type];
                if (!typeItems?.length) return null;
                return (
                  <div key={type} className="mb-8">
                    <div
                      className="flex items-center gap-1 mb-3 cursor-pointer group"
                      onClick={() =>
                        setExpandedTypes((prev) => ({
                          ...prev,
                          [type]: !prev[type],
                        }))
                      }
                    >
                      <span
                        className={`transition-transform text-xs ${expandedTypes[type] ? "rotate-90" : ""}`}
                      >
                        ▶
                      </span>
                      <h2 className=" -tight group-hover:text-gray-600 transition">
                        {CAROUSEL_TYPES[type]}
                        <span className="ml-1 font-normal text-gray-400">
                          ({typeItems.length})
                        </span>
                      </h2>
                    </div>
                    {expandedTypes[type] && (
                      <SortableGrid
                        items={typeItems}
                        type={type}
                        onReorder={handleReorder}
                        onToggleActive={handleToggleActive}
                        onDelete={handleDeleteItem}
                        onEdit={openEditModal}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
            <div className="mb-6">
              <p className="text-xs font-medium mb-3 text-gray-700">
                {importFiles.length} FILES
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  {importFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-10 h-10 object-cover"
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
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 text-center">
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
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-6 w-full">
              <div className="w-full">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  TYPE*
                </label>
                <select
                  value={selectedTypeImport}
                  onChange={(e) => setSelectedTypeImport(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-xs focus:outline-none focus:border-black"
                >
                  {Object.entries(CAROUSEL_TYPES).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <TextField
                label="CLIENT"
                placeholder="Entrer le nom du client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFiles([]);
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 font-medium hover:bg-gray-50 transition"
              >
                CANCEL
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 transition"
              >
                ✓ ADD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
        {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 w-full max-w-xl -lg ow-2xl overflow-hidden">
            {/* Header */}

            <div className="flex items-center justify-between  mb-4 border-gray-200">
              <h2 className="text-xl font-bold uppercase -wide">
                MODIFIER
              </h2>
              <Button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                variant="ghost"
                className=""
              >
                ×
              </Button>
            </div>

            {/* Content */}
            <div className=" space-y-6 max-h-[70vh] ">
              {/* Image Preview */}
              <div className="w-full grid grid-cols-2 gap-4 justify-center">
                <div className="relative ">
                  <img
                    src={editingItem.imageUrl}
                    alt={editingItem.imageName}
                    className="w-full h-full object-cover -lg ow-md"
                  />
                </div>
                <div className=" text-xs text-gray-500">
                  <p className="font-medium mb-1">{editingItem.imageName}</p>
                  <Button
                  variant="secondary"
                  >Remplacer l'image</Button>
                </div>
              </div>

              {/* Image Info */}

              {/* Form Fields Grid */}
              <div className="w-full space-y-6">
                {/* Title */}
                <TextField
                  label="TITLE"
                  placeholder="Nom de l'image"
                  value={editFormData.imageName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      imageName: e.target.value,
                    })
                  }
                  required
                />

                {/* Category and Client Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Category */}
                  <SelectField
                label="TYPE*"
                value={selectedTypeImport}
                onChange={(e) => setSelectedTypeImport(e.target.value)}
                options={Object.entries(CAROUSEL_TYPES).map(([type, label]) => ({
                  value: type,
                  label: label,
                }))}
              />


                  {/* Client */}
                  <TextField
                    label="CLIENT"
                    placeholder="Client"
                    value={editFormData.client}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        client: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Activate Toggle */}
                <div className="flex w-full p-2 border-gray-300 border items-center justify-between py-2">
                  <label         
                   className="block text-xs font-medium  uppercase"
>
                    ACTIVATE
                  </label>

                  <ToggleSwitch
                    isActive={editIsActive}
                    onChange={() => setEditIsActive(!editIsActive)}
                  />
                </div>

                {/* Danger Zone */}
                <div className="pt-4 flex justify-between w-full">
                  <h3
                   className="block text-xs font-medium  uppercase"
                   >
                    DANGER ZONE
                  </h3>
                  <Button
                    onClick={() => handleDeleteItem(editingItem.id)}
                    size="md"
                    variant="danger"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-4 mt-16 justify-between">
               <Button
                onClick={() => {
                  setShowImportModal(false);
                  setEditingItem(null);
                }}
                size="md"
                variant="secondary"
              >
                CANCEL
              </Button>
              <Button onClick={handleImportSubmit} size="md">
                Save
              </Button>
           
            </div>
          </div>
        </div>
      )}

      <ToastContainer messages={toasts} />
    </div>
  );
}
