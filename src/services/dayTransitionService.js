import { findPlayerById, savePlayer } from "../repositories/playerRepository.js";
import { forcedGoHome, goHome } from "./workdayService.js";

export async function confirmForcedDayEnd(playerId) {
    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const previousDay = player.day;

    const updatedPlayer = forcedGoHome(player);

    await savePlayer(updatedPlayer);

    return {
        player: updatedPlayer,
        dayTransition: {
            from: previousDay,
            to: updatedPlayer.day,
            forced: true
        }
    };
}

export async function confirmVoluntaryDayEnd(playerId) {
  const player = await findPlayerById(playerId);

  if (!player) {
    throw new Error("Player not found");
  }

  const previousDay = player.day;

  const updatedPlayer = goHome(player);

  await savePlayer(updatedPlayer);

  return {
    player: updatedPlayer,
    dayTransition: {
      from: previousDay,
      to: updatedPlayer.day,
      forced: false
    }
  };
}