const amqp = require('amqplib');

let channel;

async function connect() {
  // Use Docker service name for RabbitMQ connection
  const connection = await amqp.connect('amqp://guest:guest@order-rabbitmq:5672');
  channel = await connection.createChannel();
  return channel;
}

module.exports = { connect, getChannel: () => channel };
