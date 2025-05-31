import { Router } from "express";



const healthCheckRouter = Router();


// server health check route
healthCheckRouter.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
    });
});




export default healthCheckRouter;