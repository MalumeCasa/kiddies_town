"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  sidebarEnabled: boolean;
  setSidebarEnabled: (enabled: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  initialSidebarEnabled?: boolean;
}

export function SidebarProvider({ 
  children, 
  initialSidebarEnabled = true 
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useState(false);
  const [sidebarEnabled, setSidebarEnabled] = useState(initialSidebarEnabled);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isMobile,
        toggleSidebar,
        sidebarEnabled,
        setSidebarEnabled,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}