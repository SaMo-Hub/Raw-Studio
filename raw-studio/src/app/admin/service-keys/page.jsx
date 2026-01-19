"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ServiceKeysPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ password: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPassword, setEditPassword] = useState("");

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
        body: JSON.stringify({ password: formData.password }),
      });

      if (response.ok) {
        const newKey = await response.json();
        setKeys([newKey, ...keys]);
        setFormData({ password: "" });
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
        body: JSON.stringify({ password: editPassword }),
      });

      if (response.ok) {
        const updated = await response.json();
        setKeys(keys.map((k) => (k.id === id ? updated : k)));
        setEditingId(null);
        setEditPassword("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update password");
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-2xl font-bold tracking-tight">
            RAW STUDIO
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm hover:opacity-60 transition">
              Projects
            </Link>
            <span className="text-sm text-gray-600">Service Keys</span>
          </div>
        </div>
      </nav>

      <div className="pt-20 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Service Access Keys</h1>
            <p className="text-gray-600">
              Manage passwords for service user accounts
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Bouton créer */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 px-6 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
            >
              + Create Service Key
            </button>
          )}

          {/* Formulaire création */}
          {showForm && (
            <div className="mb-8 p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Create New Service Key</h2>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ password: e.target.value })
                    }
                    placeholder="Enter password (min. 6 characters)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-80 transition disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ password: "" });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Liste des clés */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading service keys...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No service keys yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="p-6 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Key ID</p>
                      <p className="font-mono text-sm break-all">{key.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          key.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {key.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created</p>
                      <p className="text-sm">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {key.expiresAt && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Expires</p>
                        <p className="text-sm">
                          {new Date(key.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Édition du mot de passe */}
                  {editingId === key.id ? (
                    <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                      <label className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePassword(key.id)}
                          className="px-4 py-2 bg-black text-white text-sm rounded hover:opacity-80 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditPassword("");
                          }}
                          className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Boutons actions */}
                  <div className="flex gap-3">
                    {editingId !== key.id && (
                      <button
                        onClick={() => setEditingId(key.id)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
                      >
                        Change Password
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleActive(key.id, key.isActive)}
                      className={`px-4 py-2 text-sm rounded transition ${
                        key.isActive
                          ? "border border-gray-300 hover:bg-gray-50"
                          : "bg-green-50 border border-green-200 hover:bg-green-100 text-green-700"
                      }`}
                    >
                      {key.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition"
                    >
                      Delete
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
