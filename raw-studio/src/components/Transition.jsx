"use client";

import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useTransition } from '@/context/TransitionContext';

export const Transition = ({primaryColor, secondaryColor}) => {
  const pathname = usePathname();
  const { isExiting, resetExit, progress } = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // Petit délai pour laisser la page se rendre avant de lancer l'animation
    const t = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    resetExit();
  }, [pathname, resetExit]);

  const formattedProgress = `${Math.round(progress)}%`;

  return (
    <>
      {/* Animation de sortie */}
      {isExiting && (
        <motion.div
          initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          style={{ backgroundColor: primaryColor, color: secondaryColor }}
          transition={{ duration: 1.2, ease: [0.9, 0, 0.1, 1] }}
          className="fixed z-100 top-0 flex justify-between left-0 w-screen h-screen origin-top text-white items-center flex p-12 pointer-events-none"
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
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{ translateY: "100%" }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
              TITLE NAME
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
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{ translateY: "100%" }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
              TITLE NAME
            </motion.h2>
          </div>
        </motion.div>
      )}

      {/* Animation d'entrée */}
      <motion.div
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 100% 0% 0%)" }}
        style={{ backgroundColor: primaryColor, color: secondaryColor }}
        transition={{ duration: 1.35, delay: 0, ease: [0.9, 0, 0.1, 1] }}
        className="fixed z-50 top-0 flex justify-between left-0 w-screen h-screen origin-top text-white items-center flex p-12 pointer-events-none"
      >
        <div className="overflow-hidden flex gap-4">
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeInOut" }}
            className="translate-y-0 uppercase text-xs"
          >
            100%
          </motion.p>
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeInOut" }}
            className="translate-y-0 uppercase text-xs"
          >
            Title Name
          </motion.p>
        </div>
        <div className="overflow-hidden flex gap-4">
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="translate-y-0 uppercase text-xs"
          >
            100%
          </motion.p>
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="translate-y-0 uppercase text-xs"
          >
            Title Name
          </motion.p>
        </div>
      </motion.div>
    </>
  );
};