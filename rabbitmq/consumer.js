const { connect } = require('./connection');

async function startConsumer() {
  const channel = await connect();
  const queue = 'order_notifications';

  await channel.assertQueue(queue, { durable: false });

  console.log('Admin is waiting for order notifications...');
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log(`New order received from customer: ${order.customer?.name} (${order.customer?.email})`);
      console.log('Order details:', order);
      channel.ack(msg);
    }
  });
}

startConsumer();
