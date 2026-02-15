"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

const CATEGORIES = ["COMMERCIAL", "MUSIC VIDEO", "WEB"];

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    longDesc: "",
    categories: [],
    externalLink: "",
    featured: false,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  // Gérer l'upload d'images
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

  // Supprimer une image uploadée
  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
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
        setError("Failed to create project");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/admin" className="text-blue-600 hover:underline text-sm">
              ← Back to Dashboard
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-12">Create New Project</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Titre */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* Description courte */}
            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <input
                type="text"
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* Description longue */}
            <div>
              <label className="block text-sm font-medium mb-2">Long Description</label>
              <textarea
                name="longDesc"
                value={formData.longDesc}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* Upload d'images */}
            <div>
              <label className="block text-sm font-medium mb-2">Upload Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full"
                />
                {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
              </div>

              {/* Aperçu des images uploadées */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Uploaded Images ({uploadedImages.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-40 object-cover rounded border border-gray-200"
                        />
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          variant="danger"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-4">Categories</label>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.categories.includes(category)
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Lien externe */}
            <div>
              <label className="block text-sm font-medium mb-2">External Link</label>
              <input
                type="url"
                name="externalLink"
                value={formData.externalLink}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium">Featured Project</label>
            </div>

            {/* Boutons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
              <Button
                href="/admin"
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
