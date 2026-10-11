import { findPlayerById } from "../repositories/playerRepository.js";
import { findDailyWorldState, saveDailyWorldState } from "../repositories/dailyWorldStateRepository.js";
import { createDailyWorldState } from "./worldStateService.js";

export async function getOrCreateDailyWorldState(
  playerId,
  random = Math.random
) {
  const player = await findPlayerById(playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const existingWorldState =
    await findDailyWorldState(
      playerId,
      player.day
    );

  if (existingWorldState) {
    return existingWorldState;
  }

  const worldState = createDailyWorldState(
    player,
    random
  );

  await saveDailyWorldState(worldState);

  return worldState;
}