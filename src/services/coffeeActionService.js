import { findPlayerById, savePlayer } from "../repositories/playerRepository.js";

import { drinkCoffee } from "./coffeeService.js";

export async function drinkCoffeeForPlayer(playerId) {
    const player = await findPlayerById(playerId);

    if (!player) {
        throw new Error("Player not found");
    }

    const result = drinkCoffee(player);

    await savePlayer(result.player);

    return result;
}