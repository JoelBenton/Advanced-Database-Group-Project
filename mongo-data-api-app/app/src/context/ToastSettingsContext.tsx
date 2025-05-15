"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { ToasterProps } from "react-hot-toast";

export type ToastPosition = ToasterProps["position"];

const ToastSettingsContext = createContext<{
  position: ToastPosition;
  setPosition: (pos: ToastPosition) => void;
}>({
  position: "bottom-right",
  setPosition: () => {},
});

const STORAGE_KEY = "toastPosition";

export function ToastSettingsProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState<ToastPosition>("bottom-right");

  // Load saved position from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return; // safety for SSR
    const saved = localStorage.getItem(STORAGE_KEY) as ToastPosition | null;
    if (saved) {
      setPosition(saved);
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (position) {
      localStorage.setItem(STORAGE_KEY, position);
    }
  }, [position]);

  return (
    <ToastSettingsContext.Provider value={{ position, setPosition }}>
      {children}
    </ToastSettingsContext.Provider>
  );
}

export const useToastSettings = () => useContext(ToastSettingsContext);
