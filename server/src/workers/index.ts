import * as dotenv from 'dotenv';
import { connectRedis } from '../redis/connection';
import { QueueWorker } from './queueWorker';
dotenv.config();

async function startQueueWorker() {
    try {
        console.info('Starting Queue Assignment Worker...');

        // connect to redis
        await connectRedis();
        console.info('✅ Redis connected');

        // create worker instance
        const worker = new QueueWorker();

        // Graceful shutdown handling
        process.on('SIGINT', () => {
            console.log('\n Received SIGINT, shutting down gracefully...');
            worker.stop();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            console.log('\n Received SIGTERM, shutting down gracefully...');
            worker.stop();
            process.exit(0);
        });

        // Start the worker
        await worker.start();

    } catch (error) {
        console.error('Failed to start worker:', error);
        process.exit(1);
    }
}


startQueueWorker();