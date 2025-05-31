import express from "express";
import authRouter from "./routers/auth";
import cors from "cors";
import conversationRouter from "./routers/conversation";
import filtersRouter from "./routers/filters";
import { meilisearch } from "./lib/meilisearch";
import { verifyConnections } from "./utils/verifyConnections";
import healthCheckRouter from "./utils/healthChecks";
import { redisClient, connectRedis } from "./redis/connection";
const app = express();

const PORT = 5000;



// Configure CORS middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // Replace with your frontend's origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

app.use(authRouter);
app.use(express.json());

// regiser routers
app.use("/api/conversations", conversationRouter);
app.use("/api/filters", filtersRouter);

app.use(healthCheckRouter);


// init redit connection
connectRedis();


app.listen(PORT, () => {
    verifyConnections();
    console.log(`Server is running on port ${PORT}`);
});
