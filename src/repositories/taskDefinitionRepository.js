import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";
import { TaskDefinition } from "../models/TaskDefinition.js";

function toTaskDefinition(data) {
    if (!data) {
        return null;
    }

    return new TaskDefinition(
        data._id,
        data.title,
        data.description,
        data.role,
        data.mandatory,
        data.difficulty,
        data.staminaCost,
        data.timeCost,
        data.baseXp,
        data.floor,
        data.sourceType,
        data.sourceId,
        data.requirements,
        data.choices
    );
}

export async function findTaskDefinitionById(taskId) {
    const database = getDatabase();

    const taskDefinitions = database.collection("taskDefinitions");

    const data = await taskDefinitions.findOne({
        _id: new ObjectId(taskId)
    });

    return toTaskDefinition(data);
}

export async function saveTaskDefinition(task) {
    const database = getDatabase();

    const taskDefinitions = database.collection("taskDefinitions");

    const taskData = {
        title: task.title,
        description: task.description,

        role: task.role,
        mandatory: task.mandatory,
        difficulty: task.difficulty,

        staminaCost: task.staminaCost,
        timeCost: task.timeCost,
        baseXp: task.baseXp,

        floor: task.floor,
        sourceType: task.sourceType,
        sourceId: task.sourceId,

        requirements: task.requirements,
        choices: task.choices
    };

    if (!task.id) {
        const result = await taskDefinitions.insertOne(taskData);

        task.id = result.insertedId;

        return task;
    }

    await taskDefinitions.updateOne(
        { _id: task.id },
        {
            $set: taskData
        }
    );

    return task;
}

export async function findTaskDefinitionsByRole(role) {
    const database = getDatabase();

    const taskDefinitions = database.collection("taskDefinitions");

    const data = await taskDefinitions
        .find({ role })
        .toArray();

    return data.map(toTaskDefinition);
}