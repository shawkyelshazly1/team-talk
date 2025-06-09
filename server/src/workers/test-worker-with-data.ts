
import * as dotenv from 'dotenv';
dotenv.config();

import { connectRedis, redisClient } from "../redis/connection";
import { QueueWorker } from "./queueWorker";


async function setupTestData() {
    console.log("Setting up test data...");

    // clear any existing data
    await redisClient.del('conversations:queue');
    await redisClient.del('users:online_teamleaders');
    await redisClient.del(`tl:tl_123:basket`);
    await redisClient.del('tl:tl_456:basket');

    // add mock conversations
    await redisClient.LPUSH('conversations:queue', ['conv_1', 'conv_2', "conv_3"]);

    // add a mock online team leader
    await redisClient.HSET('users:online_teamleaders', 'tl_123', '4');
    await redisClient.HSET('users:online_teamleaders', 'tl_456', '2');

    // initialize empty baskets
    await redisClient.SADD('tl:tl_123:basket', 'dummy');
    await redisClient.SREM('tl:tl_123:basket', 'dummy');

    // Team leader 456 already has 2 conversations
    await redisClient.SADD('tl:tl_456:basket', ['existing_conv_1', 'existing_conv_2']);

    console.log('✅ Test data ready');
}


async function runTest() {
    // 🔧 Connect to Redis first!
    console.log('🔗 Connecting to Redis...');
    await connectRedis();

    // Wait a moment for connection to be fully established
    await new Promise(resolve => setTimeout(resolve, 1000));

    await setupTestData();
    const worker = new QueueWorker();

    // Show initial queue status
    console.log('Initial status: ', await worker.getQueueStatus());

    // start worker
    worker.start();

    // check status every 2 seconds
    const statusInterval = setInterval(async () => {
        const status = await worker.getQueueStatus();
        const stats = worker.getStats();

        console.log('Status: ', status, 'Stats processed:', stats.processed);

    }, 2000);

    // stop after 10 seconds
    setTimeout(() => {
        worker.stop();
        clearInterval(statusInterval);
        console.log('Test completed');
        process.exit(0);
    }, 10000);
}

runTest().catch(console.error);