"use client";

import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useTransition } from '@/context/TransitionContext';

export default function RootTransition() {
  const pathname = usePathname();
  const { isExiting, resetExit, progress } = useTransition();

  useEffect(() => {
    resetExit();
  }, [pathname, resetExit]);

  const formattedProgress = `${Math.round(progress)}%`;

  return (
    <>
      {/* Animation de sortie - overlay global */}
      {isExiting && (
        <motion.div
          initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          style={{ backgroundColor: "#000000" }}
          transition={{ duration: 1.2, ease: [0.9, 0, 0.1, 1] }}
          className="fixed z-[999] top-0 flex justify-between left-0 w-screen h-screen origin-top text-white items-center p-12 pointer-events-none"
        >
          <div className="overflow-hidden flex gap-4">
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{ translateY: "100%" }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
              {formattedProgress}
            </motion.h2>
          </div>
          <div className="overflow-hidden flex gap-4">
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{ translateY: "100%" }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
              {formattedProgress}
            </motion.h2>
          </div>
        </motion.div>
      )}

      {/* Animation d'entrée - overlay global */}
      <motion.div
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 100% 0% 0%)" }}
        style={{ backgroundColor: "#000000" }}
        transition={{ duration: 1.35, delay: 0, ease: [0.9, 0, 0.1, 1] }}
        className="fixed z-[999] top-0 left-0 w-screen h-screen origin-top text-white items-center p-12 pointer-events-none"
      />
    </>
  );
}
