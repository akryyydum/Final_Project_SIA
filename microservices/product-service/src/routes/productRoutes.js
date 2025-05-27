const express = require('express');
const router = express.Router();
const {  requireAdmin } = require('../middleware/requireAdmin');
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

// GET /api/products/:id - get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Edit product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).send('Product not found');
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send('Product not found');
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
