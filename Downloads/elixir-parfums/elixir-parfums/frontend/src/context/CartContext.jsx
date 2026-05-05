import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('elixir_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('elixir_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, quantity = 1) => {
    const variant = product.variants.find(v => v.size === size);
    if (!variant) return;

    setItems(prev => {
      const existing = prev.find(i => i.productId === product._id && i.size === size);
      if (existing) {
        return prev.map(i => i.productId === product._id && i.size === size
          ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { productId: product._id, name: product.name, size, price: variant.price, quantity, image: product.images?.[0] }];
    });
  };

  const removeItem = (productId, size) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) return removeItem(productId, size);
    setItems(prev => prev.map(i => i.productId === productId && i.size === size ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shippingCost = total >= 1000 ? 0 : 50;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, shippingCost }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
