const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import and configure RabbitMQ consumer
require('./rabbitmq/adminConsumer').startConsumer();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
  res.send('Order Service is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});