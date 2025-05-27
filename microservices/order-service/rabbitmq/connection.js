const amqp = require('amqplib');

let channel;

async function connect() {
  // Use env variable or fallback to localhost for RabbitMQ connection
  const uri = process.env.RABBITMQ_URI || 'amqp://localhost:5672';
  const connection = await amqp.connect(uri);
  channel = await connection.createChannel();
  return channel;
}

module.exports = { connect, getChannel: () => channel };

// Automatically start admin consumer
require('./adminConsumer');
