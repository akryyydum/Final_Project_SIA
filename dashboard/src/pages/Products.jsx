import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";
import "../pages/Products.css";
import ProductCard from "../components/ProductCard";
import Sidebar from "../pages/Sidebar";

const Products = () => {
  const { products } = useContext(ProductContext);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="cart-icon">🛒</div>
      </header>

      <div
        className="main-content"
        style={{ backgroundImage: "url(background-image.jpg)" }}
      >
        <Sidebar />
        <div className="product-area">
          <div className="product-grid">
            {products.map((product, i) => (
              <ProductCard
                key={i}
                imageUrl={product.imageUrl}
                name={product.name}
                description={product.description}
                price={product.price}
                stock={product.stock} // <-- pass stock here
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
