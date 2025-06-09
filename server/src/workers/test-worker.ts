import * as dotenv from 'dotenv';
dotenv.config();

import { QueueWorker } from "./queueWorker";



const worker = new QueueWorker();


console.log('starting test worker');
worker.start();



// setop after 10 seconds for testing
setTimeout(() => {
    worker.stop();
    console.log("Final stats:", worker.getStats());
    process.exit(0);
}, 10000);
