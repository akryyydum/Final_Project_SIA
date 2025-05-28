import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();

function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const { token } = useAuth();

  // Make fetchProducts available to other functions
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function addProduct(productData) {
    try {
      await axios.post(
        "http://localhost:4000/api/products",
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProducts(); // <-- Always fetch latest products after add
    } catch (error) {
      console.error("Failed to add product", error);
    }
  }

  async function editProduct(id, updatedData) {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/products/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((product) => (product._id === id ? res.data : product))
      );
    } catch (error) {
      console.error("Failed to edit product", error);
    }
  }

  async function deleteProduct(id) {
    try {
      await axios.delete(`http://localhost:4000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  }

  async function reduceStock(id) {
    const product = products.find((p) => p._id === id);
    if (!product) {
      console.warn("Product not found");
      return;
    }
    if (product.inStock <= 0) {
      console.warn("Product out of stock");
      return;
    }

    const updatedProduct = { ...product, inStock: product.inStock - 1 };
    try {
      await editProduct(id, updatedProduct);
    } catch (error) {
      console.error("Failed to reduce stock", error);
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        deleteProduct,
        reduceStock,
        fetchProducts, // Expose fetchProducts if needed elsewhere
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

function useProductContext() {
  return useContext(ProductContext);
}

export { ProductContext, ProductProvider, useProductContext };
