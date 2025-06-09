import { Router } from "express";
import { getWorkerStats } from "../utils/workerStats";

const workerStatsRouter = Router();

// JSON API endpoint
workerStatsRouter.get('/api/worker/stats', async (req, res) => {
    try {
        const stats = await getWorkerStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get worker stats' });
    }
});

// HTML Dashboard
workerStatsRouter.get('/worker/dashboard', async (req, res) => {
    try {
        const stats = await getWorkerStats();

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Queue Worker Monitor</title>
            <meta http-equiv="refresh" content="5">
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    margin: 0; padding: 20px; background: #f5f5f5; 
                }
                .container { max-width: 1200px; margin: 0 auto; }
                h1 { color: #333; text-align: center; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                .card { 
                    background: white; border-radius: 8px; padding: 20px; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                }
                .metric { 
                    display: flex; justify-content: space-between; 
                    padding: 10px 0; border-bottom: 1px solid #eee; 
                }
                .metric:last-child { border-bottom: none; }
                .status-healthy { color: #22c55e; font-weight: bold; }
                .status-warning { color: #f59e0b; font-weight: bold; }
                .status-error { color: #ef4444; font-weight: bold; }
                .badge { 
                    padding: 4px 8px; border-radius: 4px; font-size: 12px; 
                    font-weight: bold; text-transform: uppercase; 
                }
                .badge-healthy { background: #dcfce7; color: #166534; }
                .badge-warning { background: #fef3c7; color: #92400e; }
                .badge-error { background: #fecaca; color: #991b1b; }
                .timestamp { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔧 Queue Worker Dashboard</h1>
                
                <div class="grid">
                    <!-- Overview Card -->
                    <div class="card">
                        <h2>📊 System Overview</h2>
                        <div class="metric">
                            <span>Status:</span>
                            <span class="badge badge-${stats.status}">${stats.status}</span>
                        </div>
                        <div class="metric">
                            <span>Queue Length:</span>
                            <span class="${stats.queueLength > 10 ? 'status-warning' : 'status-healthy'}">
                                ${stats.queueLength} conversations
                            </span>
                        </div>
                        <div class="metric">
                            <span>Online Team Leaders:</span>
                            <span class="${stats.onlineTeamLeaders === 0 ? 'status-error' : 'status-healthy'}">
                                ${stats.onlineTeamLeaders}
                            </span>
                        </div>
                        <div class="metric">
                            <span>Active Assignments:</span>
                            <span>${stats.totalBasketItems}</span>
                        </div>
                    </div>

                    <!-- Team Leaders Card -->
                    <div class="card">
                        <h2>👥 Team Leader Capacity</h2>
                        ${Object.keys(stats.teamLeaderSlots).length === 0 ?
                '<p style="color: #ef4444;">No team leaders online</p>' :
                Object.entries(stats.teamLeaderSlots).map(([id, slots]) => `
                                <div class="metric">
                                    <span>${id}</span>
                                    <span class="${parseInt(slots) === 0 ? 'status-error' : parseInt(slots) <= 1 ? 'status-warning' : 'status-healthy'}">
                                        ${slots} slots available
                                    </span>
                                </div>
                            `).join('')
            }
                    </div>

                    <!-- Health Check Card -->
                    <div class="card">
                        <h2>🏥 Health Indicators</h2>
                        <div class="metric">
                            <span>Queue Status:</span>
                            <span class="${stats.queueLength === 0 ? 'status-healthy' : stats.queueLength < 10 ? 'status-warning' : 'status-error'}">
                                ${stats.queueLength === 0 ? 'Empty' : stats.queueLength < 10 ? 'Normal' : 'Busy'}
                            </span>
                        </div>
                        <div class="metric">
                            <span>Team Leader Coverage:</span>
                            <span class="${stats.onlineTeamLeaders === 0 ? 'status-error' : stats.onlineTeamLeaders < 2 ? 'status-warning' : 'status-healthy'}">
                                ${stats.onlineTeamLeaders === 0 ? 'No Coverage' : stats.onlineTeamLeaders < 2 ? 'Limited' : 'Good'}
                            </span>
                        </div>
                        <div class="metric">
                            <span>Processing Capacity:</span>
                            <span class="status-healthy">
                                ${Object.values(stats.teamLeaderSlots).reduce((sum, slots) => sum + parseInt(slots), 0)} total slots
                            </span>
                        </div>
                    </div>
                </div>

                <div class="timestamp">
                    Last updated: ${new Date(stats.timestamp).toLocaleString()}
                    <br>
                    Auto-refresh every 5 seconds
                </div>
            </div>
        </body>
        </html>
        `;

        res.send(html);
    } catch (error) {
        res.status(500).send('<h1>Dashboard Error</h1><p>Failed to load worker stats</p>');
    }
});

export default workerStatsRouter;