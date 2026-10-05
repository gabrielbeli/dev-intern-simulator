import { findPlayerById, savePlayer } from "../repositories/playerRepository.js";
import { findTaskDefinitionsByRole } from "../repositories/taskDefinitionRepository.js";
import { findTaskProgressByPlayer } from "../repositories/taskProgressRepository.js";
import { promotePlayer } from "./roleProgressionService.js";

export async function confirmPromotion(playerId) {
    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const previousRole = player.role;

    const roleTasks = await findTaskDefinitionsByRole(
        player.role
    );

    const playerProgress = await findTaskProgressByPlayer(
        playerId
    );

    const promotedPlayer = promotePlayer(
        player,
        roleTasks,
        playerProgress
    );

    await savePlayer(promotedPlayer);

    return {
        player: promotedPlayer,
        promotion: {
            from: previousRole,
            to: promotedPlayer.role
        }
    };
}