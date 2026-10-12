import { findPlayerById } from "../repositories/playerRepository.js";
import { findTaskDefinitionsByRole } from "../repositories/taskDefinitionRepository.js";
import { findTaskProgressByPlayer } from "../repositories/taskProgressRepository.js";
import { getAvailableTasks, canStartTask } from "./taskAvailabilityService.js";
import { getOrCreateDailyWorldState } from "./worldStateActionService.js";
import { resolveTaskFloor } from "./worldStateService.js";

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

    const worldState =
        await getOrCreateDailyWorldState(playerId);

    const availableTasks = getAvailableTasks(
        player,
        taskDefinitions,
        taskProgress
    );

    return availableTasks.map(task => ({
        task,
        canStart: canStartTask(player, task),
        location: {
            floor: resolveTaskFloor(
                task,
                worldState
            ),
            sourceType: task.sourceType,
            sourceId: task.sourceId
        }
    }));
}

export async function getTasksForFloor(
    playerId,
    floor
) {
    const availableTasks =
        await getAvailableTasksForPlayer(playerId);

    return availableTasks.filter(
        taskEntry =>
            taskEntry.location.floor === floor
    );
}