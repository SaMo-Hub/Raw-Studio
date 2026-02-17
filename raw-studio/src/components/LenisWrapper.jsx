"use client";

import { useLenis } from "@/hooks/useLenis";
import { AnimatePresence } from "framer-motion";

export default function LenisWrapper({ children }) {
  useLenis();
  
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
}
