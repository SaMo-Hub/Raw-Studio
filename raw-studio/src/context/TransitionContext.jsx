"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  const triggerExit = useCallback(() => {
    setIsExiting(true);
    setProgress(0);
    
    // Simulation de la progression du chargement
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 30;
      if (currentProgress > 90) currentProgress = 90;
      setProgress(currentProgress);
    }, 100);

    // Atteindre 100% après 1200ms
    const timeout = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const resetExit = useCallback(() => {
    setIsExiting(false);
    setProgress(0);
  }, []);

  return (
    <TransitionContext.Provider value={{ isExiting, triggerExit, resetExit, progress }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}
