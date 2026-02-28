"use client";

import React, { createContext, useContext } from "react";

const PageAnimationContext = createContext(null);

export function PageAnimationProvider({ children, onAnimateOut }) {
  return (
    <PageAnimationContext.Provider value={{ onAnimateOut }}>
      {children}
    </PageAnimationContext.Provider>
  );
}

export function usePageAnimation() {
  return useContext(PageAnimationContext);
}
