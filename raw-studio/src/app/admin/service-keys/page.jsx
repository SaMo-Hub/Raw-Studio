"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import ToggleSwitch from "@/components/ToggleSwitch";
import Checkbox from "@/components/Checkbox";
import OptionSelector from "@/components/OptionSelector";
import ServiceKeyEditModal from "@/components/ServiceKeyEditModal";
import StatusTag from "@/components/StatusTag";
import { Sidebar } from "@/components/Sidebar";
import CategorySelector from "@/components/CategorySelector";

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
  const [editRole, setEditRole] = useState("SERVICE");
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [borderStyle, setBorderStyle] = useState({ left: 0, width: 0 });
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const buttonRefs = useRef({ ALL: null, ADMIN: null, SERVICE: null });

  // Mettre à jour la position du border animé
  useEffect(() => {
    const button = buttonRefs.current[selectedRole];
    if (button) {
      setBorderStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, [selectedRole]);

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
      const key = keys.find((k) => k.id === id);
      const response = await fetch(`/api/admin/service-keys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          isActive: !currentStatus,
          role: key.role,
        }),
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
    try {
      const updateData = {
        name: editName,
        description: editDescription,
        role: editRole,
      };

      // Only include password if it's not empty (optional update)
      if (editPassword) {
        updateData.password = editPassword;
      }

      const response = await fetch(`/api/admin/service-keys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updated = await response.json();
        setKeys(keys.map((k) => (k.id === id ? updated : k)));
        setEditingId(null);
        setEditPassword("");
        setEditName("");
        setEditDescription("");
        setEditRole("SERVICE");
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

  const handleToggleSelectedKeys = async () => {
    const keysToToggle = Array.from(selectedKeys);
    try {
      for (const id of keysToToggle) {
        const key = keys.find((k) => k.id === id);
        if (key) {
          await fetch(`/api/admin/service-keys/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !key.isActive, role: key.role }),
          });
        }
      }
      await fetchKeys();
      setSelectedKeys(new Set());
    } catch (err) {
      setError("Failed to toggle selected keys");
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
          body: JSON.stringify({ isActive: false, role: key.role }),
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
          body: JSON.stringify({ isActive: true, role: key.role }),
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

  // Gérer le tri
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Filtrer et trier les clés
  const getFilteredKeys = () => {
    let filtered = keys.filter((key) => {
      const roleMatch = selectedRole === "ALL" || key.role === selectedRole;
      const searchMatch = (key.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      return roleMatch && searchMatch;
    });

    // Appliquer le tri
    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        if (sortBy === "name") {
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
        } else if (sortBy === "role") {
          aValue = a.role || "";
          bValue = b.role || "";
        } else if (sortBy === "date") {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
    }

    return filtered;
  };

  const filteredKeys = getFilteredKeys();
  const getRoleCount = (role) => {
    if (role === "ALL") return keys.length;
    return keys.filter((k) => k.role === role).length;
  };

  return (
    <div className="min-h-screen pl-56 w-full flex bg-white">
            <Sidebar />
      
      <div className="px-6 w-full py-4">
        <div className="w-full">
        <div className="flex items-center justify-between mb-12">

          {/* Titre */}
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight">Password</h1>
            <p className="text-gray-600 text-sm mt-1">Manage service passwords</p>
          </div>

          {/* Bouton créer */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              size="md"
            >
              + Add a password
            </Button>
          )}
        </div>

        {/* Filtres et Recherche */}
        <div className=" mb-3">
          <div className="relative mb-3">
            <div className="flex gap-4">
              {["ALL", "ADMIN", "SERVICE"].map((role) => (
                <button
                  key={role}
                  ref={(el) => {
                    if (el) buttonRefs.current[role] = el;
                  }}
                  onClick={() => {
                    setSelectedRole(role);
                    setSelectedKeys(new Set());
                  }}
                  className={`pb-2 transition relative  flex items-center overflow-hidden group ${
                    selectedRole === role
                      ? "text-black font-medium"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <span className="relative inline-block overflow-hidden h-4">
                    <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                      {role}
                    </span>
                    <span className="absolute block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 top-0 left-0">
                      {role}
                    </span>
                  </span>
                  <span className="ml-1 text-xs text-gray-500">({getRoleCount(role)})</span>
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
          <div className="relative flex items-center justifycenter">
            <svg
              className="absolute left-2  w-5 h-5 text-gray-400"
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
              placeholder="Search for passwords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-fit px-4 pl-8 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
            />
            
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700  text-sm">
            {error}
          </div>
        )}

          {/* Formulaire création */}
          {showForm && (
            <div className="mb-8 p-6 border border-gray-200  bg-gray-50">
              <h2 className="text-lg font-bold mb-4 uppercase">New key</h2>
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
                    className="w-full px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-xs font-medium mb-2 uppercase">
                    Role
                  </label>
                  <OptionSelector
                    options={["SERVICE", "ADMIN"]}
                    selectedValue={formData.role}
                    onValueChange={(role) =>
                      setFormData({ ...formData, role })
                    }
                    isSingleSelect={true}
                  />
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
                    className="w-full px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
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
                    className="w-full px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ password: "", name: "", description: "", role: "SERVICE" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No service keys yet.</p>
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No service keys match your filters.</p>
            </div>
          ) : (
            <div className=" ">
      
            <div className="text-sm ">
              {/* Table Header */}
              {filteredKeys.length > 0 && (
                <div className=" grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 text-xs uppercase font-medium text-black/30 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                     {/* <input 
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = selectedKeys.size > 0 && selectedKeys.size < filteredKeys.length;
                        }
                      }}
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer -none"
                      checked={selectedKeys.size === filteredKeys.length && filteredKeys.length > 0}
                      onChange={() => {
                        if (selectedKeys.size === filteredKeys.length) {
                          setSelectedKeys(new Set());
                        } else {
                          setSelectedKeys(new Set(filteredKeys.map((k) => k.id)));
                        }
                      }}
                    /> */}
                    <Checkbox
                      checked={selectedKeys.size === filteredKeys.length && filteredKeys.length > 0}
                      indeterminate={selectedKeys.size > 0 && selectedKeys.size < filteredKeys.length}
                      onChange={() => {
                        if (selectedKeys.size === filteredKeys.length) {
                          setSelectedKeys(new Set());
                        } else {
                          setSelectedKeys(new Set(filteredKeys.map((k) => k.id)));
                        }
                      }}
                    />
                    <span>Name</span>
                  </div>
                  <div>Password</div>
                  <div>Role</div>
                  <div>Date</div>
                  <div>State</div>
                  {selectedKeys.size > 0 ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={handleToggleSelectedKeys}
                        className="px-3 py-1 bg-green-500 text-white text-xs  hover:bg-green-600 transition"
                      >
                        Toggle ({selectedKeys.size})
                      </button>
                      <button
                        onClick={handleDeleteSelected}
                        className="px-3 py-1 bg-red-500 text-white text-xs  hover:bg-red-600 transition"
                      >
                        Delete ({selectedKeys.size})
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">Actions</div>
                  )}
                </div>
              )}

              {/* Rows */}
              {filteredKeys.map((key) => (
                <div
                  key={key.id}
                  className={`grid grid-cols-6 gap-4 items-center p-4 border-b border-gray-200 transition ${
                    selectedKeys.has(key.id) ? "bg-gray-100 -50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* <input 
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedKeys.has(key.id)}
                      onChange={() => handleSelectKey(key.id)}
                    /> */}
                     <Checkbox
                      checked={selectedKeys.has(key.id)}
                      onChange={() => handleSelectKey(key.id)}
                    />
                    <span className="font-medium text-xs">{key.name || "UNNAMED"}</span>
                  </div>
                  <div className=" text-xs text-gray-600">{key.password}</div>
                  <div>
                    <span
                      className={`text-xs px-3 py-1 -full font-medium ${
                        key.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {key.role || "SERVICE"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(key.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                  <div>
                    <StatusTag isActive={key.isActive} />
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <ToggleSwitch
                      isActive={key.isActive}
                      onChange={(newStatus) => handleToggleActive(key.id, !newStatus)}
                    />
                    <button
                      onClick={() => {
                        setEditingId(key.id);
                        setEditPassword(key.password);
                        setEditName(key.name || "");
                        setEditDescription(key.description || "");
                        setEditRole(key.role || "SERVICE");
                      }}
                      className="text-gray-600 hover:text-black transition text-sm"
                      title="Edit"
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
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
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
          )}

          {/* Modal édition */}
          <ServiceKeyEditModal
            isOpen={!!editingId}
            onClose={() => {
              setEditingId(null);
              setEditPassword("");
              setEditName("");
              setEditDescription("");
              setEditRole("SERVICE");
            }}
            onSave={handleUpdatePassword}
            keyId={editingId}
            name={editName}
            password={editPassword}
            description={editDescription}
            role={editRole}
            onNameChange={setEditName}
            onPasswordChange={setEditPassword}
            onDescriptionChange={setEditDescription}
            onRoleChange={setEditRole}
          />
        </div>
      </div>
    </div>
  );
}
