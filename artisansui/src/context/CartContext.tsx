import { createContext, useContext, useState, ReactNode } from "react";

/* CART ITEM TYPE */

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;

  /* optional product attributes */
  color?: string;
  size?: string;
}

/* CONTEXT TYPE */

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (item: Omit<CartItem, "qty">) => void;

  removeFromCart: (id: number) => void;

  increaseQty: (id: number) => void;

  decreaseQty: (id: number) => void;

  clearCart: () => void;
}

/* CREATE CONTEXT */

const CartContext = createContext<CartContextType | null>(null);

/* PROVIDER */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /* ADD ITEM */

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCartItems(prev => {
      const exists = prev.find(p => p.id === item.id);

      if (exists) {
        return prev.map(p =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  /* REMOVE ITEM */

  const removeFromCart = (id: number) => {
    setCartItems(prev =>
      prev.filter(item => item.id !== id)
    );
  };

  /* INCREASE QUANTITY */

  const increaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  /* DECREASE QUANTITY */

  const decreaseQty = (id: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  /* CLEAR CART */

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* HOOK */

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return ctx;
};