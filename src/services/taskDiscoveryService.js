import { findPlayerById } from "../repositories/playerRepository.js";
import { findTaskDefinitionsByRole } from "../repositories/taskDefinitionRepository.js";
import { findTaskProgressByPlayer } from "../repositories/taskProgressRepository.js";
import { getAvailableTasks, canStartTask } from "./taskAvailabilityService.js";

export async function getAvailableTasksForPlayer(playerId) {
    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const taskDefinitions = await findTaskDefinitionsByRole(
        player.role
    );

    const taskProgress = await findTaskProgressByPlayer(
        playerId
    );

    const availableTasks = getAvailableTasks(
        player,
        taskDefinitions,
        taskProgress
    );

    return availableTasks.map(task => ({
        task,
        canStart: canStartTask(player, task)
    }));
}