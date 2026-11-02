import { findPlayerByUserId } from "../repositories/playerRepository.js";
import { getFloorState } from "./floorStateService.js";

export async function getFloorStateForUser(
    userId,
    floor
) {
    const player = await findPlayerByUserId(userId);

    if (!player) {
        throw new Error("Player profile not found");
    }

    return getFloorState(
        player.id.toString(),
        floor
    );
}