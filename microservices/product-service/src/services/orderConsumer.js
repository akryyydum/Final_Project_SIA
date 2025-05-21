// filepath: microservices/product-service/src/services/orderConsumer.js
const { connect } = require('../utils/connection');
const Product = require('../models/Product');
require('dotenv').config();
const app = require('./app');
const listenOrderEvents = require('./services/orderConsumer');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
  listenOrderEvents(); // Start RabbitMQ consumer
});

async function listenOrderEvents() {
  const channel = await connect();
  await channel.assertQueue('order_created');

  channel.consume('order_created', async (msg) => {
    const order = JSON.parse(msg.content.toString());
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }
    channel.ack(msg);
  });
}

module.exports = listenOrderEvents;