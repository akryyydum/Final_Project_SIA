import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth();

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`http://localhost:5003/api/carts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.items || [];
      setCartItems(
        items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }))
      );
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [token]);

  // Save cart to backend
  const saveCart = async (items) => {
  try {
    const token = localStorage.getItem('token');

    // Map items to match backend schema: [{ productId, quantity }]
    const cleanedItems = items.map(item => ({
      productId: item._id || item.productId, // support both key names
      quantity: item.quantity
    }));

    const response = await axios.put(
      'http://localhost:5003/api/carts/me',
      { items: cleanedItems },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Cart saved successfully:', response.data);
  } catch (error) {
    console.error('Failed to save cart:', error.response?.data || error.message);
  }
};


  // Add to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.productId === product._id || item._id === product._id
      );
      let updatedItems;
      if (existing) {
        updatedItems = prevItems.map((item) =>
          item.productId === product._id || item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [
          ...prevItems,
          { ...product, productId: product._id, quantity: 1 },
        ];
      }
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Increase quantity
  const increaseQty = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.productId === productId || item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Decrease quantity
  const decreaseQty = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.productId === productId || item._id === productId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.productId !== productId && item._id !== productId
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQty, decreaseQty, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
