import { Router } from "express";
import { meilisearchMutations } from "../meilisearch";



const adminRouter = Router();


// delete all messages from meilisearch
adminRouter.delete("/meilisearch/messages", async (req, res) => {
    const result = await meilisearchMutations.deleteAllMessagesFromMeilisearch();
    if (result.status === "succeeded") {
        res.status(200).json({ message: "All messages deleted from meilisearch successfully" });
    } else {
        res.status(500).json({ message: "Failed to delete all messages from meilisearch" });
    }
});


export default adminRouter;