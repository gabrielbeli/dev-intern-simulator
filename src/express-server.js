import express from "express";
import { internRoutes } from "./routes/internRoutes.js";
import { connectToDatabase } from "./config/database.js";

const app = express();

app.use(express.json());

app.use("/intern", internRoutes);

async function startServer() {
    try {
        await connectToDatabase();

        app.listen(3000, () => {
            console.log("Express server running on port 3000");
        });
    } catch (error) {
        console.error("Could not connect to MongoDB:", error.message);
    }
}

startServer();