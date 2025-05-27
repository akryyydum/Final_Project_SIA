const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' })); // or higher if needed
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Order service connected to MongoDB'))
  .catch(err => console.error(err));

app.use('/api/orders', orderRoutes);

module.exports = app;