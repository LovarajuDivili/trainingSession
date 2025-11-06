/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface OrderItem {
  name: string;
  brand: string;
  category: string;
  hours: string;
}

interface OrdersContextType {
  orders: OrderItem[];
  addOrder: (items: CartItem[]) => void;
}

interface CartItem {
  brand: string;
  category: string;
  quantity: number;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    // ✅ Load from localStorage on first render
    const stored = localStorage.getItem("orders");
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ Save to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[]) => {
    const newOrderItems = items.map((item) => ({
      name: `${item.brand} ${item.category}`,
      brand: item.brand,
      category: item.category.toLowerCase(),
      hours: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    setOrders((prev) => [...prev, ...newOrderItems]);
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used inside OrdersProvider");
  }
  return context;
};
