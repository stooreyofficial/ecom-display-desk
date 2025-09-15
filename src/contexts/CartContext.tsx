import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CartItem {
  id: string;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  image?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface CartContextType {
  items: CartItem[];
  customerInfo: CustomerInfo | null;
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [sessionId] = useState(() => 
    localStorage.getItem('cart_session_id') || 
    (() => {
      const id = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart_session_id', id);
      return id;
    })()
  );

  // Load cart from database on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;

      if (data) {
        const cartItems: CartItem[] = data.map(item => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          productPrice: item.product_price,
          quantity: item.quantity
        }));
        setItems(cartItems);

        // Set customer info if available
        const customerData = data.find(item => item.customer_name && item.customer_phone);
        if (customerData) {
          setCustomerInfo({
            name: customerData.customer_name!,
            phone: customerData.customer_phone!
          });
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (product: any) => {
    try {
      // Check if item already exists
      const existingItem = items.find(item => item.productId === product.id);
      
      if (existingItem) {
        await updateQuantity(product.id, existingItem.quantity + 1);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          quantity: 1,
          customer_name: customerInfo?.name,
          customer_phone: customerInfo?.phone
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: CartItem = {
        id: data.id,
        productId: data.product_id,
        productName: data.product_name,
        productPrice: data.product_price,
        quantity: data.quantity,
        image: product.image
      };

      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const item = items.find(item => item.productId === productId);
      if (!item) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.productId !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const item = items.find(item => item.productId === productId);
      if (!item) return;

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', item.id);

      if (error) throw error;

      setItems(prev => 
        prev.map(item => 
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const updateCustomerInfo = async (info: CustomerInfo) => {
    setCustomerInfo(info);
    
    // Update all cart items with customer info
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({
          customer_name: info.name,
          customer_phone: info.phone
        })
        .eq('session_id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating customer info:', error);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        customerInfo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCustomerInfo: updateCustomerInfo,
        getTotalPrice,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};