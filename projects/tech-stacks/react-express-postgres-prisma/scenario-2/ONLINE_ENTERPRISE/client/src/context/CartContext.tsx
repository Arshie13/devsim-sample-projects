import type { ReactNode } from 'react';
import { createContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types';
import toast from 'react-hot-toast';
import type { CartContextType } from './useCart';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'urbanpottery_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addToCart = (product: Product, quantity = 1) => {
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      // Check stock limit
      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      // Check stock for new item
      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }

      toast.success(`${product.name} added to cart`);
      setItems((prevItems) => [...prevItems, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      toast.success(`${item.product.name} removed from cart`);
    }
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const item = items.find((i) => i.product.id === productId);
    
    // Check stock limit
    if (item && quantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} items available in stock`);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
