"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTransition } from "@/context/TransitionContext";
import { usePageAnimation } from "@/context/PageAnimationContext";

export function TransitionLink({ className, href, children, onClick, ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  const { triggerExit } = useTransition();
  const pageAnimation = usePageAnimation();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    
    if (e.defaultPrevented) return;
    
    // Éviter la transition si c'est un lien externe ou vers la même page
    if (href === pathname || href.startsWith("http") || href.startsWith("#")) {
      return;
    }

    e.preventDefault();

    // Si on est dans une page avec animation de sortie locale, l'utiliser
    if (pageAnimation?.onAnimateOut) {
      pageAnimation.onAnimateOut(() => router.push(href), href);
    } else {
      // Sinon, utiliser l'animation globale
      triggerExit();
      setTimeout(() => {
        router.push(href);
      }, 100);
    }
  };

  return (
    <Link className={className} href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
