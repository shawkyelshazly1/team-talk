import { sql } from "drizzle-orm";
import { db } from "../db";
import { redisClient } from "../redis/connection";
import { socketIOClient } from "../socketio";

export async function verifyConnections() {
    const connections = {
        Meilisearch: "❌",
        Database: "❌",
        Server: "❌",
        Redis: "❌",
        SocketIO: "❌",
    };
    // verify meilisearch connection
    await fetch(`${process.env.MEILI_HOST}/health`).then(res => {
        if (res.status === 200) {
            connections.Meilisearch = "✅";
        }
    }).catch(error => {
        connections.Meilisearch = "❌";
    });

    // verify database connection
    try {
        await db.execute(sql`SELECT 1`);
        connections.Database = "✅";
    } catch (error) {
        connections.Database = "❌";
    }


    // verify server connection
    await fetch(`${process.env.SERVER_HOST}/health`).then(res => {
        if (res.status === 200) {
            connections.Server = "✅";
        }
    }).catch(error => {
        connections.Server = "❌";
    });


    // verify redis connection
    await redisClient.ping().then(res => {
        if (res === "PONG") {
            connections.Redis = "✅";
        }
    }).catch(error => {
        connections.Redis = "❌";
    });

    // verify socketIO connections
    if (socketIOClient) {
        connections.SocketIO = "✅";
    } else {
        connections.SocketIO = "❌";
    }



    Object.entries(connections).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });
}   
