import React, { useState } from "react";
import "../components/ProductCard.css";
import { useCart } from "../context/CartContext";
import { Button, Tooltip, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ProductDetails from "../pages/ProductDetails"; 

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  let imgSrc = "/assets/default.png";
  if (imageUrl) {
    if (imageUrl.startsWith("data:")) {
      imgSrc = imageUrl;
    } else {
      imgSrc = `data:image/jpeg;base64,${imageUrl}`;
    }
  }

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent modal opening when clicking Add to Cart
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

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const formattedPrice = price
    ? price.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      })
    : "Price not available";

  const stockStatus =
    stock > 10
      ? `In stock: ${stock} units`
      : stock > 0
      ? `Only ${stock} left! Hurry up!`
      : "Out of stock";

  return (
    <>
      <div
        className="product-card"
        aria-label={`Product card for ${name}`}
        onClick={openModal}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter") openModal();
        }}
      >
        <img
          src={imgSrc}
          alt={name}
          className="product-image"
          loading="lazy"
          aria-describedby={`desc-${_id}`}
        />
        <h2 title={name}>{name}</h2>
        <p id={`desc-${_id}`} className="product-description" title={description}>
          {description.length > 80 ? description.slice(0, 80) + "..." : description}
        </p>
        <div className="price" aria-label={`Price: ${formattedPrice}`}>
          {formattedPrice}
        </div>
        <p className="stock-status" aria-live="polite" aria-atomic="true">
          {stockStatus}
        </p>
        {categories.length > 0 && (
          <div className="product-categories" aria-label="Product categories">
            <strong>Category{categories.length > 1 ? "ies" : "y"}:</strong> {categories.join(", ")}
          </div>
        )}

        {isAdmin ? (
          <div className="admin-actions" aria-label="Admin actions" onClick={e => e.stopPropagation()}>
            <Tooltip title="Edit Product">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={onEdit}
                aria-label={`Edit product ${name}`}
              />
            </Tooltip>
            <Tooltip title="Delete Product">
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={onDelete}
                aria-label={`Delete product ${name}`}
              />
            </Tooltip>
          </div>
        ) : (
          <Button
            type="primary"
            className="cart-icon-button"
            onClick={handleAddToCart}
            block
            icon={<ShoppingCartOutlined />}
            disabled={stock === 0}
            aria-label={
              stock === 0
                ? `Add to cart disabled, ${name} out of stock`
                : `Add ${name} to cart`
            }
          >
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </div>

      <Modal
        title={name}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={700}
      >
        <ProductDetails
  _id={_id}
  name={name}
  description={description}
  price={price}
  imageUrl={imageUrl}
  categories={categories}
  stock={stock}
  onAddToBag={() => {
    addToCart({ _id, name, description, price, imageUrl, stock, categories });
    closeModal(); // <-- Call this here
  }}
/>


      </Modal>
    </>
  );
};

export default ProductCard;
