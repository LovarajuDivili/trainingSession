/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Order, OrderContextType, CartItem, BillingDetails } from "../common/types";

import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const API_BASE = "http://localhost:8000/v-1/application/cart";

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setOrders([]);
        return;
      }

      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Fetched orders from API:", response.data);
        
        // Transform the API response to match our Order interface
        const transformedOrders: Order[] = response.data.map((order: any) => ({
          id: order.id,
          user_id: order.user_id,
          items: order.items || [],
          billing_details: order.billing_details || {},
          payment_method: order.payment_method || "credit-card",
          subtotal: order.subtotal || 0,
          vat: order.vat || 0,
          total: order.total || 0,
          status: order.status || "pending",
          order_date: order.order_date || order.created_at,
          created_at: order.created_at
        }));
        
        setOrders(transformedOrders);
      } catch (error: any) {
        console.error("Failed to fetch orders:", error);
        if (error.response?.status !== 404) {
          // Only show error if it's not a "not found" error (which might mean no orders yet)
          console.error("Order fetch error:", error.response?.data);
        }
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  const addOrder = async (cartItems: CartItem[], billingDetails?: BillingDetails, paymentMethod?: string) => {
    if (!isAuthenticated || !user) {
      throw new Error("User must be authenticated to place an order");
    }

    try {
      const token = sessionStorage.getItem("token");
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const vat = subtotal * 0.18;
      const total = subtotal + vat;

      const orderData = {
        user_id: user.id,
        items: cartItems,
        billing_details: billingDetails || {},
        payment_method: paymentMethod || "credit-card",
        subtotal,
        vat,
        total,
        status: "pending"
      };

      console.log("Sending order data:", orderData);

      const response = await axios.post(`${API_BASE}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Order created successfully:", response.data);

      const newOrder: Order = {
        id: response.data.id,
        user_id: response.data.user_id,
        items: response.data.items || cartItems,
        billing_details: response.data.billing_details || billingDetails || {},
        payment_method: response.data.payment_method || paymentMethod || "credit-card",
        subtotal: response.data.subtotal || subtotal,
        vat: response.data.vat || vat,
        total: response.data.total || total,
        status: response.data.status || "pending",
        order_date: response.data.order_date || new Date().toISOString(),
        created_at: response.data.created_at || new Date().toISOString()
      };

      setOrders(prev => [newOrder, ...prev]);
      
      return newOrder;
    } catch (error: any) {
      console.error("Failed to create order:", error);
      console.error("Error details:", error.response?.data);
      throw new Error(error.response?.data?.detail || "Failed to create order");
    }
  };

  const value = {
    orders,
    addOrder,
    isLoading
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};