import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5003/api/carts/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data?.items || [];

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
          } catch {
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
  }, [token]);

  const saveCart = async (items) => {
    if (!token) {
      console.error("No auth token found, cannot save cart.");
      return;
    }

    try {
      const cleanedItems = items
        .map((item) => ({
          productId: item.productId || item._id,
          quantity: item.quantity,
        }))
        .filter((item) => !!item.productId);

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

      await fetchCart();
    } catch (error) {
      console.error("Failed to save cart:", error.response?.data || error.message);
    }
  };

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

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.productId !== productId && item._id !== productId
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
