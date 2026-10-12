import { getOrCreateDailyWorldState } from "./worldStateActionService.js";
import { getNpcsForFloor } from "./npcService.js";
import { getTasksForFloor } from "./taskDiscoveryService.js";
import { FLOORS } from "../config/gameConfig.js";

export async function getFloorState(
    playerId,
    floor
) {
    if (!FLOORS.includes(floor)) {
        throw new Error("Invalid floor");
    }

    const worldState =
        await getOrCreateDailyWorldState(playerId);

    const npcs = getNpcsForFloor(
        worldState,
        floor
    );

    const tasks = await getTasksForFloor(
        playerId,
        floor
    );

    return {
        floor,
        npcs,
        tasks
    };
}