"use client";

import { useLenis } from "@/hooks/useLenis";

export default function LenisWrapper({ children }) {
  useLenis();
  
  return children;
}
