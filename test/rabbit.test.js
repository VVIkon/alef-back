const amqp = require('amqplib');

async function test() {
	const conn = await amqp.connect('amqp://rabby:ladybug1@192.168.1.104:5672');
	console.log('Connected');

	const channel = await conn.createChannel();
	await channel.assertExchange('vi_exchange', 'direct')
	await channel.assertQueue('vi_queue');
	console.log('channel is made');
	channel.consume('vi_queue', (msg) => {
	  console.log('Тестовое сообщение:', msg.content.toString());
	  channel.ack(msg);
	}, { noAck: false });
	// await conn.close();
}

test().catch(console.error);
