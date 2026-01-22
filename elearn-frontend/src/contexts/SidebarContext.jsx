import { createContext, useContext, useState, useMemo, useCallback } from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo(() => ({
    isOpen,
    toggleSidebar,
    setIsOpen,
  }), [isOpen, toggleSidebar]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
