// src/context/ProductContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  // Fetch products from backend on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Add a new product
  const addProduct = async (productData) => {
    console.log("Token being sent:", token); // Add this line
    try {
      const res = await axios.post(
        "http://localhost:4000/api/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  // Edit a product
  const editProduct = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/products/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? res.data : product
        )
      );
    } catch (error) {
      console.error("Failed to edit product", error);
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Optional: custom hook for easier usage
export const useProductContext = () => useContext(ProductContext);
