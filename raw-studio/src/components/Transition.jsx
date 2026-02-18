"use client";

import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useTransition } from '@/context/TransitionContext';

export const Transition = ({primaryColor, secondaryColor}) => {
  const pathname = usePathname();
  const { isExiting, resetExit, progress } = useTransition();

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
        className="fixed z-50 top-0 flex justify-between left-0 w-screen h-screen origin-top text-white items-center flex p-12 pointer-events-none"
        >
          <div className="overflow-hidden flex gap-4">
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{translateY: "100%"}}
              transition={{delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
            80%
            </motion.h2>
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{translateY: "100%"}}
              transition={{delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
            TITLE NAME
            </motion.h2>
          </div>
          <div className="overflow-hidden flex gap-4">
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{translateY: "100%"}}
              transition={{delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
            80%
            </motion.h2>
            <motion.h2
              animate={{ translateY: "0%" }}
              initial={{translateY: "100%"}}
              transition={{delay: 0.4, duration: 0.5, ease: [0.9, 0, 0.1, 0.7] }}
              className="translate-y-0 uppercase text-xs"
            >
            title name
            </motion.h2>
          </div>
         

          {/* Pourcentage */}
         
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
        className="fixed z-50 top-0 flex justify-between left-0 w-screen h-screen origin-top text-white items-center flex p-12 pointer-events-none"
      >
        <div className="overflow-hidden flex gap-4">
          
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{delay:0.4,  duration: 0.4, ease: "easeInOut" }}
            className=" translate-y-0 uppercase text-xs"
          >
            80%
          </motion.p>
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{delay:0.4,  duration: 0.4, ease: "easeInOut" }}
            className=" translate-y-0 uppercase text-xs"
          >
            Title Name
          </motion.p>
        </div>
        <div className="overflow-hidden flex gap-4">
          
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className=" translate-y-0 uppercase text-xs"
          >
            80%
          </motion.p>
          <motion.p
            animate={{ translateY: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className=" translate-y-0 uppercase text-xs"
          >
            Title Name
          </motion.p>
        </div>
      
      
      </motion.div>
    </>
  )
}
