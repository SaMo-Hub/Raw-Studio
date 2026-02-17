"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useRouterTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Réinitialiser à chaque changement de route
    setIsTransitioning(false);
  }, [pathname]);

  const push = (href) => {
    if (href !== pathname) {
      setIsTransitioning(true);
      // Attendre l'animation
      setTimeout(() => {
        router.push(href);
      }, 1200);
    }
  };

  const replace = (href) => {
    if (href !== pathname) {
      setIsTransitioning(true);
      setTimeout(() => {
        router.replace(href);
      }, 1200);
    }
  };

  return { push, replace, isTransitioning };
}
