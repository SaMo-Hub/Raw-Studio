"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isExiting, setIsExiting] = useState(false);

  const triggerExit = useCallback(() => {
    setIsExiting(true);
  }, []);

  const resetExit = useCallback(() => {
    setIsExiting(false);
  }, []);

  return (
    <TransitionContext.Provider value={{ isExiting, triggerExit, resetExit }}>
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
