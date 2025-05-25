// src/context/ProductContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // ✅ Fetch products from backend on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products"); // adjust if needed
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  // When a new product is added
  const addProduct = async (product) => {
    try {
      const token = localStorage.getItem("token"); // get the token here

      const res = await axios.post(
        "http://localhost:4000/api/products",
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`, // add Authorization header
          },
        }
      );

      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
