"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const FavoritesContext = createContext<{
  favorites: string[];
  toggleFavorite: (id: string) => void;
} | null>(null);

// Shared across routes for this visit; account-based storage will come later.
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  function toggleFavorite(id: string) {
    setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }

  return <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
