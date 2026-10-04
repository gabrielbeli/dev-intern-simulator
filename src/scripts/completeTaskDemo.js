import { connectToDatabase, getDatabase } from "../config/database.js";
import { completeTaskForPlayer } from "../services/gameTaskService.js";

async function completeTaskDemo() {
    try {
        await connectToDatabase();

        const database = getDatabase();

        const players = database.collection("players");
        const taskDefinitions = database.collection("taskDefinitions");

        const player = await players.findOne({
            name: "Gabriel",
            userId: null
        });

        if (!player) {
            throw new Error("Demo player not found");
        }

        const task = await taskDefinitions.findOne({
            title: "Unexpected Production Issue"
        });

        if (!task) {
            throw new Error("Demo task not found");
        }

        const result = await completeTaskForPlayer(
            player._id.toString(),
            task._id.toString(),
            "A"
        );

        console.log("Task completed successfully");
        console.log("XP:", result.player.xp);
        console.log("Stamina:", result.player.stamina);
        console.log("Time blocks:", result.player.usedTimeBlocks);
        console.log("Badges:", result.player.badgeScores);
    } catch (error) {
        console.error("Could not complete task:", error.message);
    }
}

completeTaskDemo();