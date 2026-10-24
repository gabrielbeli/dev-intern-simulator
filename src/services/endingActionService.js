import { findPlayerById, savePlayer } from "../repositories/playerRepository.js";
import { completeCampaign, completeSecretEnding } from "./endingService.js";

export async function completeCampaignForPlayer(
    playerId
) {
    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const result = completeCampaign(player);

    await savePlayer(result.player);

    return result;
}

export async function completeSecretEndingForPlayer(
    playerId
) {
    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const result = completeSecretEnding(player);

    await savePlayer(result.player);

    return result;
}