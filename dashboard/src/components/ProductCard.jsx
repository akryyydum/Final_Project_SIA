import React from "react";
import "../components/ProductCard.css";
import { useCart } from "../context/CartContext";

const ProductCard = ({ _id, imageUrl, name, description, price, stock }) => {
  const { addToCart } = useCart();

  let imgSrc = "/assets/default.png";

  if (imageUrl) {
    if (imageUrl.startsWith("data:")) {
      imgSrc = imageUrl;
    } else {
      imgSrc = `data:image/jpeg;base64,${imageUrl}`;
    }
  }

  const handleAddToCart = () => {
    // Pass the product object with _id for CartContext
    addToCart({
      _id,
      name,
      description,
      price,
      imageUrl,
      stock,
    });
  };

  return (
    <div className="product-card">
      <img src={imgSrc} alt={name} className="product-image" />
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Price: ${price}</p>
      <p>Stock: {stock}</p>
      <button
        className="cart-icon-button"
        onClick={handleAddToCart}
        title="Add to Cart"
      >
        🛒
      </button>
    </div>
  );
};

export default ProductCard;
