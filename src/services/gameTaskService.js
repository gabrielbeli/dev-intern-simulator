import { findPlayerById, savePlayer } from "../repositories/playerRepository.js";
import { findTaskDefinitionById, findTaskDefinitionsByRole } from "../repositories/taskDefinitionRepository.js";
import { findTaskProgress, saveTaskProgress, findTaskProgressByPlayer } from "../repositories/taskProgressRepository.js";
import { resolveTask } from "./taskResolutionService.js";
import { canPromotePlayer, getRoleConfig } from "./roleProgressionService.js";
import { getDatabaseClient } from "../config/database.js";
import { isTaskUnlocked, canStartTask } from "./taskAvailabilityService.js";

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

    const playerProgress = await findTaskProgressByPlayer(
        playerId
    );

    if (
        !isTaskUnlocked(
            player,
            task,
            playerProgress
        )
    ) {
        throw new Error(
            "Task is not available for player"
        );
    }

    if (!canStartTask(player, task)) {
        throw new Error(
            "Not enough stamina to start task"
        );
    }

    const {
        player: updatedPlayer,
        progress,
        forcedDayEnd

    } = resolveTask(
        player,
        task,
        choiceId
    );

    const client = getDatabaseClient();
    const session = client.startSession();

    try {
        await session.withTransaction(async () => {
            await savePlayer(updatedPlayer, session);
            await saveTaskProgress(progress, session);
        });
    } finally {
        await session.endSession();
    }

    const roleTasks = await findTaskDefinitionsByRole(
        updatedPlayer.role
    );


    const updatedPlayerProgress = [
        ...playerProgress,
        progress
    ];

    const promotionAvailable = canPromotePlayer(
        updatedPlayer,
        roleTasks,
        updatedPlayerProgress
    );

    const roleConfig = getRoleConfig(updatedPlayer.role);

    return {
        player: updatedPlayer,
        progress,

        promotion: {
            available: promotionAvailable,
            nextRole: promotionAvailable
                ? roleConfig.nextRole
                : null
        },
        dayEnd: {
            forced: forcedDayEnd
        }
    };
}