const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Cart service connected to MongoDB'))
  .catch(err => console.error(err));

app.use('/api/carts', cartRoutes);

module.exports = app;