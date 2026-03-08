"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Button from "@/components/Button";
import { TransitionLink } from "@/components/TransitionLink";
import { PageAnimationProvider } from "@/context/PageAnimationContext";
import { useRouter } from "next/navigation";




function Carousel({ title, items, icon, gallery, description, reverse = false }) {
  const scrollContainer = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Dupliquer les items pour créer une boucle infinie
  const duplicatedItems = items.length > 0 ? [...items, ...items, ...items] : [];

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container || items.length === 0) return;

    let animationFrameId;
    let scrollSpeed = reverse ? -1 : 1; // pixels par frame (négatif pour inverser)
    
    const animate = () => {
      container.scrollLeft += scrollSpeed;
      
      // Réinitialiser au début ou à la fin selon la direction
      if (reverse) {
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 3;
        }
      } else {
        if (container.scrollLeft >= container.scrollWidth / 3) {
          container.scrollLeft = 0;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    if (!isHovering) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [items.length, isHovering]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-20">
      <div className="px-10 mb-8">
        <div className="flex justify-between w-full">
          <div className="overflow-hidden h-fit">
      <h2 className=" uppercase translate-y-[140%] text-white " data-carousel-title={title}>
        {title}
      </h2>
          </div>
      {gallery && (
<TransitionLink 
  className="overflow-hidden " 
  href="/raw-sport/gallery"
>
           <Button 
     dark={true} className="translate-y-[140%]" data-carousel-button>
            Voir la galerie
            </Button>
          </TransitionLink>
      )}
 
        </div>
{/* <p className="max-w-2xl ">
  {description}
</p> */}
      </div>

      <div
        className="relative group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {/* Scroll container */}
        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex-shrink-0  translate-y-[140%] w-80 h-80 group/item overflow-hidden"
              data-carousel-item={title}
            >
              <img
                src={item.imageUrl}
                alt={item.imageName}
                className="w-full h-full object-cover group-hover/item:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RawSportPage() {
  const router = useRouter();
  const [homeItems, setHomeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Animation de SORTIE ──────────────────────────────────────────────
  const animateOut = (onComplete, destination) => {
    const tl = gsap.timeline({ onComplete });
console.log(destination);

    // Animer l'overlay blanc qui monte (seulement si ce n'est pas vers la galerie)
    const isGalleryNavigation = destination && destination.includes("/raw-sport/gallery");
    if(!isGalleryNavigation) {
    const screenOverlay = document.querySelector("[data-screen-overlay]");
    if (screenOverlay) {
      tl.to(screenOverlay, {
        y: "0%",
        duration: 0.8,
        ease: "expo.in",
        delay: 0.1,
      }, 0);
    }
    }
    // Animer les boutons galerie vers le haut
    const galleryButtons = document.querySelectorAll("[data-carousel-button]");
    if (galleryButtons.length > 0) {
      tl.to(galleryButtons, {
        y: "-80px",
        duration: 0.5,
        stagger: { each: 0.04, from: "start" },
        ease: "expo.in",
      }, 0);
    }

    // Animer les titres du carousel vers le haut
    const carouselTitles = document.querySelectorAll("[data-carousel-title]");
    if (carouselTitles.length > 0) {
      tl.to(carouselTitles, {
        y: "-80px",
        duration: 0.5,
        stagger: { each: 0.04, from: "start" },
        ease: "expo.in",
      }, 0);
    }

    // Animer les items du carousel vers le bas
    const carouselItems = document.querySelectorAll("[data-carousel-item]");
    if (carouselItems.length > 0) {
      tl.to(carouselItems, {
        y: "120%",
        duration: 0.6,
        stagger: { each: 0.02, from: "start" },
        ease: "expo.in",
      }, 0.1);
    }
  };

  useEffect(() => {
    fetchHomeItems();
  }, []);

  // Animation d'entrée des éléments
  useEffect(() => {
    if (!loading && homeItems.length > 0) {
      const tl = gsap.timeline();

      // Animer les titres des carousels
      const carouselTitles = document.querySelectorAll("[data-carousel-title]");
      if (carouselTitles.length > 0) {
        tl.fromTo(
          carouselTitles,
          { y: "100%" },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "expo.out",
          },
          0
        );
      }

      // Animer les boutons galerie
      const galleryButtons = document.querySelectorAll("[data-carousel-button]");
      if (galleryButtons.length > 0) {
        tl.fromTo(
          galleryButtons,
          { y: "140%" },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "expo.out",
          },
          0
        );
      }

      // Animer les items des carousels
      const carouselItems = document.querySelectorAll("[data-carousel-item]");
      if (carouselItems.length > 0) {
        tl.fromTo(
          carouselItems,
          { y: "120%" },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: { each: 0.1, from: "start" },
            ease: "expo.out",
          },
          0.2
        );
      }
    }
  }, [loading, homeItems]);

  const fetchHomeItems = async () => {
    try {
      const response = await fetch("/api/raw-sport/home");
      if (response.ok) {
        const data = await response.json();
        setHomeItems(data);
      } else {
        setError("Impossible de charger les données");
      }
    } catch (err) {
      console.error("Failed to load home items:", err);
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  // Group items by type
  const athletesItems = homeItems.filter((item) => item.type === "athletes");
  console.log(athletesItems);
  
  const pressItems = homeItems.filter((item) => item.type === "press");
  const clubsItems = homeItems.filter((item) => item.type === "clubs");

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

        <div className="pt-60 py-20">
        {/* Header Section */}
      

        {/* Athletes Section */}
        {athletesItems.length > 0 && (
          <Carousel gallery={true} description={"Lorem ipsum dolor sit amet, consectetur, consectetur neque elit gravida suscipit phasellus egestas fames. Nunc aliquet consequat facilisis ut sapien adipiscing volutpat et dignissim a. Mauris nunc eget mauris diam quisque egestas habitasse"} title="Sportifs de RAW+SPORT" items={athletesItems} icon="🏆" />
        )}

        {/* Press Section */}
        {pressItems.length > 0 && (
          <Carousel title="Relation de Presse" items={pressItems} icon="📰" reverse={true} />
        )}

        {/* Clubs Section */}
        {clubsItems.length > 0 && (
          <Carousel title="Club de Sport" items={clubsItems} icon="⚽" />
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400"></p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && homeItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun élément disponible</p>
          </div>
        )}
        </div>
      </div>
    </PageAnimationProvider>
  );
}
