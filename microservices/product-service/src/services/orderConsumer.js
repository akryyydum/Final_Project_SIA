const { connect } = require('../../../rabbitmq/connection');
const Product = require('../models/Product');

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