import React from "react";
import "../components/ProductCard.css";
import { useCart } from "../context/CartContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Button } from "antd";

const ProductCard = ({
  _id,
  imageUrl,
  name,
  description,
  price,
  stock,
  categories = [],
  isAdmin,
  onEdit,
  onDelete,
}) => {
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
    addToCart({
      _id,
      name,
      description,
      price,
      imageUrl,
      stock,
      categories,
    });
  };

  return (
    <div className="product-card">
      <img src={imgSrc} alt={name} className="product-image" />
      <h2>{name}</h2>
      <p>{description}</p>
      <div className="price">₱{price?.toLocaleString()}</div>
      <p>Stock: {stock}</p>
      {categories.length > 0 && (
        <div className="product-categories">
          <strong>Categories:</strong> {categories.join(", ")}
        </div>
      )}
      {isAdmin ? (
        <div className="admin-actions">
          <IconButton onClick={onEdit} color="primary" aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} color="error" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </div>
      ) : (
        <Button
          type="primary"
          className="cart-icon-button"
          onClick={handleAddToCart}
          block
          icon={<span role="img" aria-label="cart">🛒</span>}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};

export default ProductCard;
