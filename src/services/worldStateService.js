import { NPCS } from "../config/gameConfig.js";
import { DailyWorldState } from "../models/DailyWorldState.js";

export function createDailyWorldState(
    player,
    random = Math.random
) {
    const worldState = new DailyWorldState(
        null,
        player.id,
        player.day
    );

    for (const npc of Object.values(NPCS)) {
        const index = Math.floor(
            random() * npc.allowedFloors.length
        );

        const floor = npc.allowedFloors[index];

        worldState.setNpcFloor(
            npc.id,
            floor
        );
    }

    return worldState;
}

export function resolveTaskFloor(
    task,
    worldState
) {
    if (task.sourceType === "npc") {
        return worldState.getNpcFloor(
            task.sourceId
        );
    }

    return task.floor;
}