import { findTasksByInternId, findTaskById, updateTask } from "../repositories/taskRepository.js";
import { findIntern, updateIntern } from "../repositories/internRepository.js";

export async function getTasksByInternId(internId, status) {

    const tasks = await findTasksByInternId(internId, status);

    return tasks;    
}

export async function completeTask(taskId) {
    const task = await findTaskById(taskId);

    if (!task) {
        return null;
    }

    task.complete();

    const intern = await findIntern(
        task.internId.toString()
    );

    if (!intern) {
        throw new Error("Intern assigned to task not found");
    }

    intern.gainXp(task.xpReward);

    await updateTask(task);
    await updateIntern(intern);

    return {
        task,
        intern
    };
}