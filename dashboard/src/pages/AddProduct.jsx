import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import "../pages/AddProduct.css";

const AddProduct = () => {
  const { addProduct } = useContext(ProductContext);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState(""); // NEW: stock
  const [productImage, setProductImage] = useState(null);
  const [productCategory, setProductCategory] = useState("");
  const [productTags, setProductTags] = useState("");

  const navigate = useNavigate();

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageBase64 = productImage ? await convertToBase64(productImage) : "";

    const product = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice), // ✅ Fix here
      stock: parseInt(productStock, 10),
      imageUrl: imageBase64,
      categories: [productCategory],
      tags: productTags.split(",").map((tag) => tag.trim()),
    };

    try {
      await addProduct(product);
      navigate("/products");
      console.log("Sending product:", product);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>
        <label>
          Product Description:
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Product Price:
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Product Stock:
          <input
            type="number"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            placeholder="e.g. 25"
            required
          />
        </label>
        <label>
          Product Category:
          <input
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            placeholder="e.g. Electronics"
            required
          />
        </label>
        <label>
          Product Tags:
          <input
            type="text"
            value={productTags}
            onChange={(e) => setProductTags(e.target.value)}
            placeholder="e.g. smartphone, android, 5G"
          />
          <small>Separate tags with commas</small>
        </label>
        <label>
          Product Image:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file.size > 2 * 1024 * 1024) {
                alert("Image too large (max 2MB)");
                return;
              }
              setProductImage(file);
            }}
            required
          />
        </label>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
