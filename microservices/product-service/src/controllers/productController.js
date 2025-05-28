const Product = require('../models/Product'); // <-- Add this line

exports.createProduct = async (req, res) => {
  try {
    console.log("Received body:", req.body); // 👈 Add this
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

const decreaseStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log("Current stock:", product.stock);
    console.log("Quantity to decrease:", quantity);

    if (product.stock < quantity) {
      console.log("Insufficient stock");
      return res.status(400).json({ error: 'Not enough stock' });
    }

    product.stock -= quantity;
    const updatedProduct = await product.save();
    console.log("Updated stock:", updatedProduct.stock);

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error decreasing stock:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Export all controllers
module.exports = {
  createProduct: async (req, res) => {
    try {
      console.log("Received body:", req.body);
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Product not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Update failed" });
    }
  },
  decreaseStock
};
