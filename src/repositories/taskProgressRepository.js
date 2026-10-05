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

export async function saveTaskProgress(progress, session = null) {
  const database = getDatabase();

  const taskProgress = database.collection("taskProgress");
  const options = session ? { session } : {};

  try {
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
    },
      options
    );

    progress.id = result.insertedId;

    return progress;
  } catch (error) {
    const isDuplicateTaskProgress =
      error.code === 11000 &&
      error.keyPattern?.playerId &&
      error.keyPattern?.taskId;

    if (isDuplicateTaskProgress) {
      throw new Error(
        "Task already completed by player"
      );
    }

    throw error;
  }
}

export async function findTaskProgressByPlayer(playerId) {
  const database = getDatabase();

  const taskProgress = database.collection("taskProgress");

  const data = await taskProgress
    .find({
      playerId: new ObjectId(playerId)
    })
    .toArray();

  return data.map(progress =>
    new TaskProgress(
      progress._id,
      progress.playerId,
      progress.taskId,
      progress.choiceId,
      progress.xpEarned,
      progress.staminaSpent,
      progress.timeSpent,
      progress.badgeImpact,
      progress.dayCompleted,
      progress.completedAt
    )
  );
} 