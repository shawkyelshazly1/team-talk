import type { Conversation } from "@shared/types";
import { redisClient } from "../redis/connection";
import { socketIOClient } from "../socketio";



interface AssignmentEvent {
    type: 'assign_conversation';
    teamleaderId: string;
    conversation: Conversation;
}

export class AssignmentEventHandler {
    private subscriber: typeof redisClient;

    constructor() {
        // Create a separate Redis connection for subscribing
        this.subscriber = redisClient.duplicate();
    }

    async start() {
        try {
            await this.subscriber.connect();

            // subscribe to assignment events
            await this.subscriber.subscribe('assignment_events', (message) => {
                this.handleAssignmentEvent(message);
            });

            console.info('Assignment event handler started');

        } catch (error) {
            console.error('Failed to start assignment event handler:', error);
        }
    }

    private async handleAssignmentEvent(message: string) {
        try {
            const event: AssignmentEvent = JSON.parse(message);

            switch (event.type) {
                case 'assign_conversation':
                    // Emit socket event to team leader
                    socketIOClient
                        .to(`user_${event.teamleaderId}`)
                        .emit("assign_conversation", {
                            conversation: event.conversation,
                        });

                    console.info(`Emitted assign_conversation to user_${event.teamleaderId}`);
                    break;

                default:
                    console.warn(`Unknown assignment event type: ${event.type}`);
            }

        } catch (error) {
            console.error('Error handling assignment event:', error);
        }
    }

    async stop() {
        await this.subscriber.unsubscribe();
        await this.subscriber.quit();
    }
}