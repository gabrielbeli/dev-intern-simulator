import { NPCS } from "../config/gameConfig.js";

export function getNpcConfig(npcId) {
    const npc = Object.values(NPCS).find(
        currentNpc => currentNpc.id === npcId
    );

    if (!npc) {
        throw new Error("Invalid NPC");
    }

    return npc;
}

export function getNpcsForFloor(
    worldState,
    floor
) {
    return Object.values(NPCS).filter(
        npc =>
            worldState.getNpcFloor(npc.id) === floor
    );
}