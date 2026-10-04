import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";
import { TaskProgress } from "../models/TaskProgress.js";

export async function findTaskProgress(playerId, taskId) {
    const database = getDatabase();

    const taskProgress = database.collection("taskProgress");

    const data = await taskProgress.findOne({
        playerId: new ObjectId(playerId),
        taskId: new ObjectId(taskId)
    });

    if (!data) {
        return null;
    }

    return new TaskProgress(
        data._id,
        data.playerId,
        data.taskId,
        data.choiceId,
        data.xpEarned,
        data.staminaSpent,
        data.timeSpent,
        data.badgeImpact,
        data.dayCompleted,
        data.completedAt
    );
}

export async function saveTaskProgress(progress) {
    const database = getDatabase();

    const taskProgress = database.collection("taskProgress");

    const result = await taskProgress.insertOne({
        playerId: progress.playerId,
        taskId: progress.taskId,
        choiceId: progress.choiceId,

        xpEarned: progress.xpEarned,
        staminaSpent: progress.staminaSpent,
        timeSpent: progress.timeSpent,

        badgeImpact: progress.badgeImpact,

        dayCompleted: progress.dayCompleted,
        completedAt: progress.completedAt
    });

    progress.id = result.insertedId;

    return progress;
}