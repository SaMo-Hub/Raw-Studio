"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ServiceKeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ password: "", name: "", description: "", role: "SERVICE" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  // Charger les clés
  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch("/api/admin/service-keys");
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      }
    } catch (err) {
      console.error("Failed to load keys:", err);
      setError("Failed to load service keys");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const response = await fetch("/api/admin/service-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          password: formData.password,
          name: formData.name,
          description: formData.description,
          role: formData.role,
        }),
      });

      if (response.ok) {
        const newKey = await response.json();
        setKeys([newKey, ...keys]);
        setFormData({ password: "", name: "", description: "", role: "SERVICE" });
        setShowForm(false);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create service key");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/service-keys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        const updated = await response.json();
        setKeys(keys.map((k) => (k.id === id ? updated : k)));
      }
    } catch (err) {
      setError("Failed to update key");
    }
  };

  const handleUpdatePassword = async (id) => {
    if (!editPassword) {
      setError("Password cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/admin/service-keys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          password: editPassword,
          name: editName,
          description: editDescription,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setKeys(keys.map((k) => (k.id === id ? updated : k)));
        setEditingId(null);
        setEditPassword("");
        setEditName("");
        setEditDescription("");
        // Recharger les données pour s'assurer que tout est à jour
        await fetchKeys();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleDeleteKey = async (id) => {
    if (!confirm("Are you sure you want to delete this service key?")) return;

    try {
      const response = await fetch(`/api/admin/service-keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setKeys(keys.filter((k) => k.id !== id));
      } else {
        setError("Failed to delete key");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleSelectKey = (id) => {
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedKeys(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedKeys.size === keys.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(keys.map((k) => k.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedKeys.size === 0) return;
    if (!confirm(`Delete ${selectedKeys.size} selected service key(s)?`)) return;

    try {
      for (const id of selectedKeys) {
        await fetch(`/api/admin/service-keys/${id}`, {
          method: "DELETE",
        });
      }
      setKeys(keys.filter((k) => !selectedKeys.has(k.id)));
      setSelectedKeys(new Set());
    } catch (err) {
      setError("Failed to delete selected keys");
    }
  };

  const handleDeactivateSelected = async () => {
    if (selectedKeys.size === 0) return;

    try {
      for (const id of selectedKeys) {
        const key = keys.find((k) => k.id === id);
        await fetch(`/api/admin/service-keys/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: false }),
        });
      }
      setKeys(
        keys.map((k) =>
          selectedKeys.has(k.id) ? { ...k, isActive: false } : k
        )
      );
      setSelectedKeys(new Set());
    } catch (err) {
      setError("Failed to deactivate selected keys");
    }
  };

  const handleActivateSelected = async () => {
    if (selectedKeys.size === 0) return;

    try {
      for (const id of selectedKeys) {
        const key = keys.find((k) => k.id === id);
        await fetch(`/api/admin/service-keys/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: true }),
        });
      }
      setKeys(
        keys.map((k) =>
          selectedKeys.has(k.id) ? { ...k, isActive: true } : k
        )
      );
      setSelectedKeys(new Set());
    } catch (err) {
      setError("Failed to activate selected keys");
    }
  };

  // Déterminer l'état des clés sélectionnées
  const getSelectedKeysState = () => {
    if (selectedKeys.size === 0) return { hasActive: false, hasInactive: false };
    
    let hasActive = false;
    let hasInactive = false;

    for (const id of selectedKeys) {
      const key = keys.find((k) => k.id === id);
      if (key) {
        if (key.isActive) hasActive = true;
        else hasInactive = true;
      }
    }

    return { hasActive, hasInactive };
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between ">

          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold uppercase tracking-tight">PASSWORD</h1>
          </div>

          {/* Bouton créer */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 px-4 py-2 bg-black text-white text-xs uppercase font-medium rounded hover:opacity-80 transition"
            >
              + CREATE
            </button>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

          {/* Formulaire création */}
          {showForm && (
            <div className="mb-8 p-6 border border-gray-200 rounded">
              <h2 className="text-lg font-bold mb-4 uppercase">NEW KEY</h2>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium mb-2 uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-xs font-medium mb-2 uppercase">
                    Role
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="SERVICE">Service</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium mb-2 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-xs font-medium mb-2 uppercase">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-black text-white text-xs uppercase font-medium rounded hover:opacity-80 transition disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ password: "", name: "", description: "" });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded text-xs uppercase font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tableau */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No service keys yet.</p>
            </div>
          ) : (
            <div className="border border-black">
              {/* Header du tableau */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-black text-xs uppercase font-medium text-black">
                <div className="col-span-3 flex gap-2 w-fit text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 cursor-pointer rounded-none"
                    checked={selectedKeys.size === keys.length && keys.length > 0}
                    onChange={handleSelectAll}
                  />
                <div className="">NAME</div>
                </div>
                <div className="col-span-2">PASSWORD</div>
                <div className="col-span-1">ROLE</div>
                <div className="col-span-2">DATE</div>
                <div className="col-span-2">STATE</div>
                
                {/* Boutons d'action */}
                {selectedKeys.size > 0 && (() => {
                  const { hasActive, hasInactive } = getSelectedKeysState();
                  return (
                    <div className="col-span-2 flex gap-1 justify-end">
                      {hasInactive && (
                        <button
                          onClick={handleActivateSelected}
                          className="text-xs font-medium hover:underline text-green-600"
                          title={`Activate ${selectedKeys.size} key(s)`}
                        >
                          ACTIVATE
                        </button>
                      )}
                      {hasActive && (
                        <button
                          onClick={handleDeactivateSelected}
                          className="text-xs font-medium hover:underline text-yellow-600"
                          title={`Deactivate ${selectedKeys.size} key(s)`}
                        >
                          DEACTIVATE
                        </button>
                      )}
                      <button
                        onClick={handleDeleteSelected}
                        className="text-xs font-medium hover:underline text-red-600"
                        title={`Delete ${selectedKeys.size} key(s)`}
                      >
                        DELETE
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Rows */}
              {keys.map((key) => (
                <div key={key.id} className="grid grid-cols-12 gap-4 p-4 border-b border-black items-center text-sm">
                  <div className="col-span-3 items-center gap-2 flex w-fit text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedKeys.has(key.id)}
                      onChange={() => handleSelectKey(key.id)}
                    />
                  <div className="">{key.name || "UNNAMED"}</div>
                  </div>
                  <div className="col-span-2 font-mono text-xs">{key.password}</div>
                  <div className="col-span-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      key.role === "ADMIN" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {key.role || "SERVICE"}
                    </span>
                  </div>
                  <div className="col-span-2 text-xs">
                    {new Date(key.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        key.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {key.isActive ? "ACTIVE" : "DESACTIVE"}
                    </span>
                  </div>
                  <div className="col-span-2 flex gap-2 justify-end">
                    <button
                      onClick={() => handleToggleActive(key.id, key.isActive)}
                      className="text-xs font-medium hover:underline"
                    >
                      {key.isActive ? "DESACTIVER" : "ACTIVER"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(key.id);
                        setEditPassword(key.password);
                        setEditName(key.name || "");
                        setEditDescription(key.description || "");
                      }}
                      className="text-xs font-medium hover:underline text-blue-600"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-xs font-medium hover:underline text-red-600"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal édition */}
          {editingId && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
              onClick={() => {
                setEditingId(null);
                setEditPassword("");
                setEditName("");
                setEditDescription("");
              }}
            >
              <div 
                className="bg-white p-8 w-full max-w-md h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-6 uppercase">PASSWORD</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase">Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase">Password</label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase">Password</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const currentKey = keys.find(k => k.id === editingId);
                          handleToggleActive(editingId, currentKey?.isActive);
                        }}
                        className="flex-1 px-3 py-2 bg-black text-white text-xs font-medium rounded hover:opacity-80"
                      >
                        ACTIVATE
                      </button>
                      <button
                        onClick={() => {
                          const currentKey = keys.find(k => k.id === editingId);
                          handleToggleActive(editingId, currentKey?.isActive);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 text-xs font-medium rounded hover:bg-gray-50"
                      >
                        DESACTIVATE
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-6">
                    <button
                      onClick={() => handleUpdatePassword(editingId)}
                      className="flex-1 px-4 py-2 bg-black text-white text-xs uppercase font-medium rounded hover:opacity-80"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditPassword("");
                        setEditName("");
                        setEditDescription("");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-xs uppercase font-medium rounded hover:bg-gray-50"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
