const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Product service connected to MongoDB'))
  .catch(err => console.error(err));

app.use('/api/products', productRoutes);

module.exports = app;
