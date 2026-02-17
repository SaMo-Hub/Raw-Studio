"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTransition } from "@/context/TransitionContext";

export function TransitionLink({ href, children, onClick, ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  const { triggerExit } = useTransition();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    
    if (e.defaultPrevented) return;
    
    // Éviter la transition si c'est un lien externe ou vers la même page
    if (href === pathname || href.startsWith("http") || href.startsWith("#")) {
      return;
    }

    e.preventDefault();
    triggerExit();

    setTimeout(() => {
      router.push(href);
    }, 1200);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
