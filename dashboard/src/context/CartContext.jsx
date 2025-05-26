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
      const res = await axios.get("http://localhost:5003/api/carts/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.items || [];

      // Fetch product details for each cart item
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          try {
            const productRes = await axios.get(
              `http://localhost:4000/api/products/${item.productId}`
            );
            return {
              ...productRes.data,
              quantity: item.quantity,
              productId: item.productId,
            };
          } catch  {
            return item;
          }
        })
      );

      setCartItems(detailedItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error.response?.data || error.message);
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, [token]);

  // Save cart to backend
  const saveCart = async (items) => {
    if (!token) {
      console.error("No auth token found, cannot save cart.");
      return;
    }
    try {
      const cleanedItems = items.map((item) => ({
        productId: item.productId || item._id,
        quantity: item.quantity,
      })).filter(item => !!item.productId);

      console.log("Saving cart with items:", cleanedItems);

      await axios.put(
        "http://localhost:5003/api/carts/me",
        { items: cleanedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch full product details after saving
      await fetchCart();
      console.log("Cart saved and refreshed successfully");
    } catch (error) {
      console.error("Failed to save cart:", error.response?.data || error.message);
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
          { ...product, productId: product._id, quantity: 1 }, // <-- use product._id
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

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
