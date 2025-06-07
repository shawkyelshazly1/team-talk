import { assignConversationToTeamleader } from "./conversation";

let isAssigning = false; // flag to prevent multiple assignments

export const triggerQueueAssignment = async (): Promise<void> => {

    if (isAssigning) return;

    isAssigning = true;

    try {
        // keep trying to assign conversations until we have no more conversations to assign
        let assignmentMade = true;
        let attempts = 0;
        const maxAttempts = 50;

        while (assignmentMade && attempts < maxAttempts) {
            const result = await assignConversationToTeamleader();
            if (result) {
                assignmentMade = true;
            } else {
                assignmentMade = false;
            }
            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.warn("⚠️ Hit max assignment attempts, stopping to prevent infinite loop");
        }

    } catch (error) {
        console.error("Error assigning conversations:", error);
    } finally {
        isAssigning = false;
    }
}

