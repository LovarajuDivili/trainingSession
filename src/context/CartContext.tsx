/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import type { CartContextType, CartItem } from "../common/types";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = "http://localhost:8000/v-1/application/cart";

  // Get cart from API when user changes or component mounts
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !user) {
        setCart([]);
        return;
      }

      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Fetched cart from API:", response.data);
        setCart(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, isAuthenticated]);

  const syncCartToAPI = async (updatedCart: CartItem[]) => {
    if (!isAuthenticated || !user) return;

    try {
      const token = sessionStorage.getItem("token");
      const subtotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const vat = subtotal * 0.18;
      const total = subtotal + vat;

      await axios.put(
        `${API_BASE}/`,
        {
          items: updatedCart,
          subtotal,
          vat,
          total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart synced to API successfully");
    } catch (error) {
      console.error("Failed to sync cart to API:", error);
    }
  };

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i._id === item._id);
      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedCart = [
          ...prevCart,
          {
            ...item,
            product_id: item._id,
            quantity: 1,
            price: item.price || 0,
            stock: item.stock || 0,
          } as CartItem,
        ];
      }

      // Sync to API
      if (isAuthenticated) {
        syncCartToAPI(updatedCart);
      }

      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== id);
      
      // Sync to API
      if (isAuthenticated) {
        syncCartToAPI(updatedCart);
      }
      
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    
    if (isAuthenticated) {
      const clearCartAPI = async () => {
        try {
          const token = sessionStorage.getItem("token");
          await axios.delete(`${API_BASE}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Cart cleared from API");
        } catch (error) {
          console.error("Failed to clear cart in API:", error);
        }
      };
      clearCartAPI();
    }
  };

  const updateCartForUser = (newUser: any) => {
    if (!newUser) {
      setCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        updateCartForUser,
        isLoading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};