"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { TransitionLink } from "@/components/TransitionLink";
import { PageAnimationProvider } from "@/context/PageAnimationContext";
import { useRouter } from "next/navigation";

export default function RawSportGalleryPage() {
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (data.isLoggedIn && (data.role === "ADMIN" || data.role === "SERVICE")) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, [router]);
  // ─── Animation de SORTIE ──────────────────────────────────────────────
  const animateOut = (onComplete, destination) => {
    const tl = gsap.timeline({ onComplete });

    // Animer l'overlay blanc qui monte (seulement si ce n'est pas un retour vers raw-sport)
    const isReturningToHome = destination && destination.includes("/raw-sport");
    if(!isReturningToHome) {
      const screenOverlay = document.querySelector("[data-screen-overlay]");
      if (screenOverlay) {
        tl.to(screenOverlay, {
          y: "0%",
          duration: 0.8,
          ease: "expo.in",
          delay: 0.2,
        }, 0);
      }
    }

    // Animer les boutons de filtre vers le haut
    const filterButtons = document.querySelectorAll("[data-gallery-filter]");
          const backButton = document.querySelector("[data-gallery-back]");

          if (backButton) {
            
            tl.to(backButton, {
              y: "-80px",
              duration: 0.5,
              stagger: { each: 0.04, from: "start" },
              ease: "expo.in",
            }, 0);
          }
    if (filterButtons.length > 0) {
      tl.to(filterButtons, {
        y: "-80px",
        duration: 0.5,
        stagger: { each: 0.04, from: "start" },
        ease: "expo.in",
      }, 0);
    }

    // Animer les images vers le bas
    const galleryImages = document.querySelectorAll("[data-gallery-image]");
    if (galleryImages.length > 0) {
      tl.to(galleryImages, {
        y: "120%",
        duration: 0.6,
        stagger: { each: 0.01, from: "start" },
        ease: "expo.in",
      }, 0.1);
    }

    // Animer les titres de catégories vers le bas
    const categoryTitles = document.querySelectorAll("[data-gallery-title]");
    if (categoryTitles.length > 0) {
      tl.to(categoryTitles, {
        y: "60px",
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "expo.in",
      }, 0);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Animation d'entrée des éléments
  useEffect(() => {
    if (!loading && galleryItems.length > 0) {
      const tl = gsap.timeline();

      // Animer le bouton back et les filtres
      const backButton = document.querySelector("[data-gallery-back]");
      const filterButtons = document.querySelectorAll("[data-gallery-filter]");

      if (backButton) {
        tl.fromTo(
          backButton,
          { y: "140%",},
          { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
          0
        );
      }

      if (filterButtons.length > 0) {
        tl.fromTo(
          filterButtons,
          {y: "180%",},
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: "expo.out",
          },
          0.1
        );
      }

      // Animer les titres des catégories
      const categoryTitles = document.querySelectorAll("[data-gallery-title]");
      if (categoryTitles.length > 0) {
        tl.fromTo(
          categoryTitles,
          { y: 60, },
          {
            y: 0,
            opacity: 1,

            duration: 0.9,
            stagger: 0.15,
            ease: "expo.out",
          },
          0.2
        );
      }

      // Animer les images
      const galleryImages = document.querySelectorAll("[data-gallery-image]");
      if (galleryImages.length > 0) {
        tl.fromTo(
          galleryImages,
          { y: "120%" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.0,
            stagger: { each: 0.05, from: "start" },
            ease: "expo.out",
          },
          0.3
        );
      }
    }
  }, [loading, galleryItems]);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch("/api/raw-sport/gallery");
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      } else {
        setError("Impossible de charger la galerie");
      }
    } catch (err) {
      console.error("Failed to load gallery items:", err);
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically create categories based on gallery items
  const uniqueCategories = ["all", ...new Set(galleryItems.map((item) => item.category))];
  
  const displayCategories = selectedCategory === "all" 
    ? [...new Set(galleryItems.map((item) => item.category))].map((category) => ({
        key: category,
        label: category.charAt(0).toUpperCase() + category.slice(1).replace("-", " "),
        items: galleryItems.filter((item) => item.category === category),
      }))
    : [{
        key: selectedCategory,
        label: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace("-", " "),
        items: galleryItems.filter((item) => item.category === selectedCategory),
      }];

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-black text-white flex items-center justify-center">
  //             <Navbar />
        
  //       {/* <p className="text-gray-400">Chargement de la galerie...</p> */}
  //     </div>
  //   );
  // }

  return (
    <PageAnimationProvider onAnimateOut={animateOut}>
      <div className="min-h-screen bg-black text-white relative">
        {/* Overlay blanc pour la transition */}
        <div 
          className="fixed inset-0 bg-white pointer-events-none z-50"
          style={{ transform: "translateY(100%)" }}
          data-screen-overlay
        />
        
        <Navbar />
        
        <div className="px-10 py-20">
          {/* Back Button and Filter Buttons */}
          {isAuthorized && (
            <div className="gap-2 flex overflow-hidden mb-12">
            <TransitionLink
              href="/raw-sport"
              className="text-xs translate-y-[140%] uppercase tracking-wide text-gray-400 hover:text-white "
              data-gallery-back
              >
              ← Back
            </TransitionLink>
          </div>)
            }

          <div className="gap-2 flex overflow-hidden mb-12" data-gallery-filter-container>
            {uniqueCategories.map((category) => (
              <Button
              data-gallery-filter
            dark={true}
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "primary" : "ghost"}
              size="sm"
              className="flex translate-y-[140%] items-center gap-2"
              title={category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
            >
              {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
            </Button>
            ))}
          </div>

          {/* Gallery Sections by Category */}
          {displayCategories.map((category) =>
            category.items.length > 0 ? (
              <div key={category.key} className="mb-20">
                <div className="h-fit overflow-hidden mb-8">
                <h2 className="text-lg h-fit translate-y-[140%] uppercase text-white " data-gallery-title>
                  {category.label}
                </h2>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  {category.items.map((item) => (
                    <div key={item.id} className="">
                     <div className="overflow-hidden h-fit">
                      <img
                       data-gallery-image
                       src={item.imageUrl}
                       alt={item.imageName}
                       className="w-full translate-y-[140%] h-auto "
                       />
                       </div>
                       <div className="h-fit overflow-hidden">

                      <p                        data-gallery-image
 className="w-full truncate translate-y-[140%]  mt-2 text-xs text-gray-400">{item.imageName}</p>
 </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}

          {/* {displayCategories.every((cat) => cat.items.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400">Aucun élément disponible</p>
            </div>
          )} */}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </PageAnimationProvider>
  );
}
