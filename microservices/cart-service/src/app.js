const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

app.use(cors());
// Increase the payload limit to 10mb (adjust as needed)
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Cart service connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/carts', cartRoutes);

module.exports = app;  // only export the app, don't start server here
