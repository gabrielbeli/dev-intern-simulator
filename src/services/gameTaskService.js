import { findPlayerById, savePlayer } from "../repositories/playerRepository.js";
import { findTaskDefinitionById } from "../repositories/taskDefinitionRepository.js";
import { findTaskProgress, saveTaskProgress } from "../repositories/taskProgressRepository.js";
import { resolveTask } from "./taskResolutionService.js";


export async function completeTaskForPlayer(
    playerId,
    taskId,
    choiceId
) {
    const existingProgress = await findTaskProgress(
        playerId,
        taskId
    );

    if (existingProgress) {
        throw new Error("Task already completed by player");
    }

    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const task = await findTaskDefinitionById(taskId);

    if (!task) {
        throw new Error("Task not found");
    }

    const { player: updatedPlayer, progress } = resolveTask(
        player,
        task,
        choiceId
    );

    await savePlayer(updatedPlayer);
    await saveTaskProgress(progress);

    return {
        player: updatedPlayer,
        progress
    };
}