"use client";
import { usePathname } from "next/navigation";
import { Transition } from "./Transition";

export function TransitionWithKey() {
  const pathname = usePathname();
  
  return (
    <Transition 
      key={pathname} // force le re-mount à chaque changement de route
      primaryColor="#000000" 
      secondaryColor="#ffffff" 
    />
  );
}