// order-service/rabbitmq/adminConsumer.js

const { connect } = require('./connection');

async function startAdminConsumer() {
  try {
    const channel = await connect();
    const queue = 'order_notifications';

    await channel.assertQueue(queue, { durable: false });

    console.log('[✔] Admin consumer is waiting for messages in queue:', queue);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        
        if (data.type === 'NEW_ORDER' && data.to === 'admin') {
          console.log('[📦] New order received by admin:', data.order);
          // Add this for clarity
          console.log('[🔔] Admin notified for order:', data.order._id);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('Admin consumer failed to connect:', err.message);
  }
}

startAdminConsumer();
