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
