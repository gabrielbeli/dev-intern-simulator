import { connectToDatabase, getDatabase } from "../config/database.js";

async function createIndexes() {
    await connectToDatabase();

    const database = getDatabase();

    const taskProgress = database.collection("taskProgress");

    await taskProgress.createIndex(
        {
            playerId: 1,
            taskId: 1
        },
        {
            unique: true
        }
    );

    console.log("Indexes created successfully");
}

createIndexes();