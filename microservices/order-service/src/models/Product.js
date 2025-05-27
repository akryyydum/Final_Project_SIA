const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  // Add any other fields you want to populate
});

module.exports = mongoose.model('Product', productSchema);