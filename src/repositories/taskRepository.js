import { ObjectId} from "mongodb";
import { getDatabase } from "../config/database.js";
import { Task } from "../models/Task.js";

export async function findTasksByInternId(internId, status) {

    const database = getDatabase();

    const tasks = database.collection("tasks");

    const filter = {
        internId: new ObjectId(internId)
    };

    if (status) {
        filter.status = status;
    }

    const data = await tasks.find(filter).toArray();

    return data.map(task => {
        return new Task(
            task._id,
            task.title,
            task.type,
            task.difficulty,
            task.xpReward,
            task.status,
            task.internId
        );
    });
}

export async function findTaskById(taskId) {
    const database = getDatabase();

    const tasks = database.collection("tasks");

    const data = await tasks.findOne({
        _id: new ObjectId(taskId)
    });

    if (!data) {
        return null;
    }

    return new Task(
        data._id,
        data.title,
        data.type,
        data.difficulty,
        data.xpReward,
        data.status,
        data.internId
    );
}

export async function updateTask(task) {
    const database = getDatabase();

    const tasks = database.collection("tasks");

    await tasks.updateOne(
        { _id: task.id },
        {
            $set: {
                title: task.title,
                type: task.type,
                difficulty: task.difficulty,
                xpReward: task.xpReward,
                status: task.status,
                internId: task.internId
            }
        }
    );

    return task;
}