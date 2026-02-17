"use client";

import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useTransition } from '@/context/TransitionContext';

export const Transition = ({primaryColor, secondaryColor}) => {
  const pathname = usePathname();
  const { isExiting, resetExit } = useTransition();

  useEffect(() => {
    // Réinitialise l'état de sortie quand la route change
    resetExit();
  }, [pathname, resetExit]);

  return (
    <>
      {/* Animation de sortie */}
      {isExiting && (
        <motion.div
          initial={{
            clipPath: "inset(0% 100% 0% 0%)",
          }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
          }}
          style={{backgroundColor: primaryColor, color: secondaryColor}}
          transition={{ duration: 1.2, ease: [0.9, 0, 0.1, 1] }}
          className="fixed top-0 left-0 w-screen h-screen origin-top text-white items-center flex flex-col justify-center pointer-events-none z-40"
        >
          <div className="overflow-hidden">
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{translateY: "100%"}}
              transition={{delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="font-supply translate-y-0 uppercase text-xs"
            >
              (agency)
            </motion.h2>
          </div>
          <div className="overflow-hidden flex flex-col items-baseline h-[10vw]">
            <motion.h1
              initial={{translateY: "100%"}}
              animate={{ translateY: "0%" }}
              transition={{delay: 0.2, duration: 0.6, ease: [0.9, 0, 0.1, 0.7] }}
              className="font-ztbroskon text-[12vw]/[12vw] uppercase h-fit"
            >
              Sordulo
            </motion.h1>
          </div>
        </motion.div>
      )}

      {/* Animation d'entrée */}
      <motion.div
        initial={{
          clipPath: "inset(0% 0% 0% 0%)",
        }}
        animate={{
          clipPath: "inset(0% 100% 0% 0%)",
        }}
        style={{backgroundColor: primaryColor, color: secondaryColor}}
        transition={{ duration: 1.35, delay: 0, ease: [0.9, 0, 0.1, 1] }}
        className="fixed z-50 top-0 left-0 w-screen h-screen origin-top text-white items-center flex flex-col justify-center pointer-events-none"
      >
        <div className="overflow-hidden">
          <motion.h2
            animate={{ translateY: "100%" }}
            transition={{delay: 0.35, duration: 0.4, ease: "easeInOut" }}
            className="font-supply translate-y-0 uppercase text-xs"
          >
            (agency)
          </motion.h2>
        </div>
        <div className="overflow-hidden flex flex-col items-baseline h-[10vw]">
          <motion.h1
            animate={{ translateY: "100%" }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
            className="font-ztbroskon text-[12vw]/[12vw] uppercase h-fit"
          >
            Sordulo
          </motion.h1>
        </div>
      </motion.div>
    </>
  )
}
