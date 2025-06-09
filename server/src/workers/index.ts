import * as dotenv from 'dotenv';
import { connectRedis } from '../redis/connection';
import { QueueWorker } from './queueWorker';
import { redisCleanupService } from '../services/redisCleanupService';
dotenv.config();

async function startQueueWorker() {
    try {
        console.info('Starting Queue Assignment Worker...');

        // connect to redis
        await connectRedis();
        console.info('✅ Redis connected');

        // Pre-startup Cleanup
        await redisCleanupService.cleanupStaleData();

        // create worker instance
        const worker = new QueueWorker();

        //  graceful shutdown
        const shutdown = async (signal: string) => {
            console.log(`\n Received ${signal}, shutting down gracefully...`);

            // Stop worker first
            worker.stop();

            // Give it time to finish current operations
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Final cleanup
            await redisCleanupService.gracefulShutdown();

            process.exit(0);
        };

        // Graceful shutdown handling
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        // Start the worker
        await worker.start();

    } catch (error) {
        console.error('Failed to start worker:', error);
        process.exit(1);
    }
}


startQueueWorker();