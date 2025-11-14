/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartDrawerContextType } from "../common/types";



const CartDrawerContext = createContext<CartDrawerContextType | undefined>(
  undefined
);

export const CartDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartDrawerContext.Provider
      value={{ isDrawerOpen, openDrawer, closeDrawer }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => {
  const context = useContext(CartDrawerContext);
  if (!context)
    throw new Error("useCartDrawer must be used within a CartDrawerProvider");
  return context;
};
