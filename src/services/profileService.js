import { findPlayerByUserId, savePlayer } from "../repositories/playerRepository.js";
import { Player } from "../models/Player.js";
import { DEFAULT_AVATAR_IDS } from "../config/gameConfig.js";

export async function createPlayerProfile(
    userId,
    name,
    avatarId
) {
    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        throw new Error("Player name is required");
    }

    if (!DEFAULT_AVATAR_IDS.includes(avatarId)) {
        throw new Error("Invalid starting avatar");
    }

    const existingPlayer =
        await findPlayerByUserId(userId);

    if (existingPlayer) {
        throw new Error(
            "User already has a player profile"
        );
    }

    const player = new Player(
        null,
        userId,
        name.trim(),
        avatarId
    );

    await savePlayer(player);

    return player;
}

export async function getPlayerProfile(userId) {
    const player = await findPlayerByUserId(userId);

    if (!player) {
        throw new Error("Player profile not found");
    }

    return player;
}

export async function changePlayerAvatar(
    userId,
    avatarId
) {
    const player = await findPlayerByUserId(userId);

    if (!player) {
        throw new Error("Player profile not found");
    }

    player.changeAvatar(avatarId);

    await savePlayer(player);

    return player;
}