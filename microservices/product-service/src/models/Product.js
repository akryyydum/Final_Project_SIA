const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  categories: [String], // e.g., ["laptop", "apple"]
  tags: [String],       // e.g., ["new", "featured"]
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);