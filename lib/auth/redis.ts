import { createClient } from 'redis';

// const redis = createClient({
//   url: process.env.REDIS_URL
// });

const redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

redis.on('error', err => console.log('Redis Client Error', err));

redis.connect()
	.then(() => console.log('Connected to Redis'))
	.catch(err => console.error('Failed to connect to Redis:', err));

export default redis;