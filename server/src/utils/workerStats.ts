import { redisClient } from "../redis/connection";


export interface WorkerStats {
    queueLength: number;
    onlineTeamLeaders: number;
    totalBasketItems: number;
    teamLeaderSlots: Record<string, string>;
    timestamp: string;
    status: 'healthy' | 'warning' | 'error';
    workerIsRunning: boolean;
}

export async function getWorkerStats(): Promise<WorkerStats> {
    try {
        const queueLength = await redisClient.lLen('conversations:queue');
        const teamLeaderData = await redisClient.hGetAll('users:online_teamleaders');
        const onlineTeamLeaders = Object.keys(teamLeaderData).length;

        // check worker heartbeat
        const heartbeat = await redisClient.get('worker:heartbeat');
        const workerIsRunning = heartbeat ? (Date.now() - parseInt(heartbeat)) < 10000 : false;

        let totalBasketItems = 0;
        for (const tlId of Object.keys(teamLeaderData)) {
            const basketSize = await redisClient.sCard(`tl:${tlId}:basket`);
            totalBasketItems += basketSize;
        }

        // Determine status
        let status: 'healthy' | 'warning' | 'error' = 'healthy';

        // Error conditions (system issues)
        if (!workerIsRunning && queueLength > 0) {
            status = 'error'; // Worker not running but has queued items
        }

        // Warning conditions (operational issues, not errors)
        if (onlineTeamLeaders === 0 && queueLength > 0) {
            status = 'warning'; // No coverage for waiting conversations
        } else if (queueLength > 50) {
            status = 'warning'; // Very high queue
        } else {
            const totalAvailableSlots = Object.values(teamLeaderData)
                .reduce((sum, slots) => sum + parseInt(slots), 0);

            if (queueLength > totalAvailableSlots && totalAvailableSlots > 0) {
                status = 'warning'; // Queue exceeds current capacity
            }
        }

        return {
            queueLength,
            onlineTeamLeaders: Object.keys(teamLeaderData).length,
            totalBasketItems,
            teamLeaderSlots: teamLeaderData,
            timestamp: new Date().toISOString(),
            status,
            workerIsRunning
        };
    } catch (error) {
        console.error('Error getting worker stats:', error);
        // Only actual system errors reach here
        return {
            queueLength: 0,
            onlineTeamLeaders: 0,
            totalBasketItems: 0,
            teamLeaderSlots: {},
            timestamp: new Date().toISOString(),
            status: 'error', // Real error - Redis down, connection failed, etc.
            workerIsRunning: false
        };
    }
}