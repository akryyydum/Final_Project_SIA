const amqp = require('amqplib');

let channel;

async function connect() {
  const connection = await amqp.connect('amqp://rabbitmq');
  channel = await connection.createChannel();
  return channel;
}

module.exports = { connect, getChannel: () => channel };
