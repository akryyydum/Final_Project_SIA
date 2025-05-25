const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/requireAdmin');
const Product = require('../models/Product');

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new product
router.post("/", requireAdmin, async (req, res) => {
  console.log("POST /api/products hit");
  try {
    const { name, description, price, stock, imageUrl, categories, tags } = req.body;

    if (!name || !description || isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ message: "Missing or invalid product fields" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      imageUrl,
      categories,
      tags
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
